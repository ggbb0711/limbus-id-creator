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
using Server.Services.SavedInfoService;
using Server.Services.UtilServices;
using Server.Services.UtilServices.Background;
using Server.Util.Authorization;
using Server.Util.Interceptors;
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
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddControllers()
    .AddJsonOptions(options=>{
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddSwaggerGen();
if(env.Mode.Equals("Published")) builder.Services.AddDbContext<ServerDbContext>(options =>options.UseNpgsql(
    Environment.GetEnvironmentVariable("RemoteConnection"), 
    builder =>
    {
        builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
    }).AddInterceptors(new DeleteImagesAttachToSkillInterceptor(),new ImageInterceptor()));
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
builder.Services.AddScoped<ISaveInfoRepository<SavedIDInfo,SavedId>,SaveInfoRepository<SavedIDInfo,SavedId>>();
builder.Services.AddScoped<ISaveInfoRepository<SavedEGOInfo,SavedEgo>,SaveInfoRepository<SavedEGOInfo,SavedEgo>>();
builder.Services.AddScoped<ISavedInfoService<SavedIDInfo,SavedId>,SavedInfoService<SavedIDInfo,SavedId>>();
builder.Services.AddScoped<ISavedInfoService<SavedEGOInfo,SavedEgo>,SavedInfoService<SavedEGOInfo,SavedEgo>>();
builder.Services.AddScoped<ISavedSkillRepository,SavedSkillRepository>();
builder.Services.AddScoped<IPostRepository,PostRepository>();
builder.Services.AddScoped<ICommentRepository,CommentRepository>();
builder.Services.AddScoped<IPostViewRepository,PostViewRepository>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IUserService,UserService>();
builder.Services.AddScoped<IOAuthService<GoogleJsonWebSignature.Payload>,GoogleOAuthService>();
builder.Services.AddScoped<ISessionService,SessionService>();
builder.Services.AddScoped<ICookieSessionService,CookieSessionService>();
builder.Services.AddSingleton<IUploadService,AWSS3Service>();
builder.Services.AddSingleton<IDeleteService,AWSS3Service>();
builder.Services.AddSingleton<IAuthorizationHandler,SameUserAuthorizationHandler>();
builder.Services.AddScoped<IImageObjService,ImageObjService>();
builder.Services.AddScoped<IPostService,PostService>();
builder.Services.AddScoped<ICommentService,CommentService>();
builder.Services.AddScoped<IPostViewService,PostViewService>();
builder.Services.AddHostedService<DeleteExpiredSessionsBackgroundService>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
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

app.UseSwagger();
app.UseSwaggerUI();

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
