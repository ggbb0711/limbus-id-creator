using System.Text;
using System.Text.Json.Serialization;
using DotNetEnv;
using FluentValidation;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Features.Auth.Background;
using Server.Features.Auth.Repository;
using Server.Features.Auth.Service;
using Server.Features.Comment.Repository;
using Server.Features.Comment.Service;
using Server.Features.Images.Messaging;
using Server.Features.Images.Repository;
using Server.Features.Images.Service;
using Server.Features.Post.Repository;
using Server.Features.Post.Service;
using Server.Features.SaveInfo.Repository;
using Server.Features.SaveInfo.Service;
using Server.Features.User.Repository;
using Server.Features.User.Service;
using Server.Shared.Authorization;
using Server.Shared.CloudStorage.Service;
using Server.Shared.Database;
using Server.Shared.Database.Interceptor;
using Server.Shared.Middleware;
using Server.Shared.Model;


Env.Load();
var env = Server.Shared.Config.EnvironmentVariables.LoadFromEnvironment();

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
        throw new Server.Shared.Exception.ValidationException("Validation failed: "+kvp.Value?.Errors.Select(e=>e.ErrorMessage).ToArray().ToString());
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
