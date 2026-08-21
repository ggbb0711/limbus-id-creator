using System.Text;
using System.Text.Json.Serialization;
using DotNetEnv;
using FluentValidation;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.CommentService;
using Server.Interface.ServiceInterface.IJwtTokenService;
using Server.Interface.ServiceInterface.ImageObjService;
using Server.Interface.ServiceInterface.IPostService;
using Server.Interface.ServiceInterface.SavedInfoService;
using Server.Interface.ServiceInterface.SessionInterface;
using Server.Interface.ServiceInterface.StaticStorageService;
using Server.Interface.ServiceInterface.UserService;
using Server.Interface.ServiceInterface.UtilService;
using Server.Middleware;
using Server.Models;
using Server.PostViewService;
using Server.Repositories;
using Server.Services;
using Server.Services.CommentService;
using Server.Services.ImageObjService;
using Server.Services.JwtTokenService;
using Server.Services.PostService;
using Server.Services.SavedEGOInfoService;
using Server.Services.SavedInfoService;
using Server.Services.UtilServices;
using Server.Util.Authorization;
using Server.Util.RabbitMQPublisher;


Env.Load();
var env = Server.Util.Config.EnvironmentVariables.LoadFromEnvironment();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddDataProtection();

builder.Services.AddCors(options=>
{
    options.AddPolicy("AllowOrigin",
    policy=>
    {
        policy.WithOrigins(env.FrontendUri)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<Server.Filters.ValidationActionFilter>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddControllers(options =>
{
    options.Filters.AddService<Server.Filters.ValidationActionFilter>();
});
builder.Services.AddControllers()
    .AddJsonOptions(options=>{
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddSwaggerGen();
if(env.Mode.Equals("Published")) builder.Services.AddDbContext<ServerDbContext>(options =>options.UseNpgsql(Environment.GetEnvironmentVariable("RemoteConnection"), builder =>
    {
        builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
    }));
else builder.Services.AddDbContext<ServerDbContext>(options =>options.UseNpgsql(Environment.GetEnvironmentVariable("DefaultConnection")));
builder.Services.Configure<ApiBehaviorOptions>(options=>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var kvp = context.ModelState
            .First(kvp => kvp.Value?.Errors.Count>0);
        throw new Server.Util.ApiException.ValidationException("Validation failed: "+kvp.Value?.Errors.Select(e=>e.ErrorMessage).ToArray().ToString());
    };
});
builder.Services.AddSingleton<RabbitMQUploadingImagePublisher>();
builder.Services.AddHostedService<RabbitMQUploadingImageConsumerService>();
builder.Services.AddSingleton(env);
builder.Services.AddSingleton<RabbitMQDeletingImagePublisher>();
builder.Services.AddHostedService<RabbitMQDeletingImageConsumerService>();
builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<ISessionRepository,SessionRepository>();
builder.Services.AddScoped<IImageObjRepository,ImageObjRepository>();
builder.Services.AddScoped<ISavedInfoRepository<SavedIDInfo,SavedId>,SavedIDInfoRepository>();
builder.Services.AddScoped<ISavedInfoRepository<SavedEGOInfo,SavedEgo>,SavedEGOInfoRepository>();
builder.Services.AddScoped<IPostRepository,PostRepository>();
builder.Services.AddScoped<ICommentRepository,CommentRepository>();
builder.Services.AddScoped<IPostViewRepository,PostViewRepository>();
builder.Services.AddTransient<IJwtTokenService, JwtTokenService>();
builder.Services.AddTransient<IUserService,UserService>();
builder.Services.AddTransient<IOAuthService<GoogleJsonWebSignature.Payload>,GoogleOAuthService>();
builder.Services.AddTransient<ISessionService,SessionService>();
builder.Services.AddTransient<ICookieSessionService,CookieSessionService>();
builder.Services.AddSingleton<IUploadService,AWSS3Service>();
builder.Services.AddSingleton<IDeleteService,AWSS3Service>();
builder.Services.AddSingleton<IAuthorizationHandler,SameUserAuthorizationHandler>();
builder.Services.AddTransient<IImageObjService,ImageObjService>();
builder.Services.AddTransient<ISavedInfoService<SavedIDInfo>,SavedIDInfoService>();
builder.Services.AddTransient<ISavedInfoService<SavedEGOInfo>,SavedEGOInfoService>();
builder.Services.AddTransient<IPostService,PostService>();
builder.Services.AddTransient<ICommentService,CommentService>();
builder.Services.AddTransient<IPostViewService,PostViewService>();
builder.Services.AddHostedService<BackgroundHostedService>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddLogging();
builder.Services.AddAuthentication()
    .AddJwtBearer(config=>
    {
        config.SaveToken = true;
        config.MapInboundClaims = false;
        config.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWTSecret")!)),
            ValidateIssuer = true,
            ValidIssuer = "id-creator-api",
            ValidateAudience = true,
            ValidAudience = "id-creator-client",
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("SameUser", policy =>policy.Requirements.Add(new SameUserRequirement()));

builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

if(!env.ListenOn.IsNullOrEmpty())builder.WebHost.UseUrls(env.ListenOn??"");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/SaveIDInfo/create"), app =>
{
    app.UseCheckUploadSaveIDFileMiddlewareExtension();
    app.UseCheckUrlUploadSaveIDMiddlewareExtension();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/SaveIDInfo/update"), app =>
{
    app.UseCheckUploadSaveIDFileMiddlewareExtension();
    app.UseCheckUrlUploadSaveIDMiddlewareExtension();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/SaveEGOInfo/create"), app =>
{
    app.UseCheckUploadSaveIDFileMiddlewareExtension();
    app.UseCheckUrlUploadSaveEGOMiddlewareExtension();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/SaveEGOInfo/update"), app =>
{
    app.UseCheckUploadSaveIDFileMiddlewareExtension();
    app.UseCheckUrlUploadSaveEGOMiddlewareExtension();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/Post/create"), app =>
{
    app.UseCheckPostUrlMiddlewareExtension();
});

app.Run();
