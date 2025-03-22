using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RepositoryLayer;
using RepositoryLayer.Models;
using RepositoryLayer.Repositories;
using RepositoryLayer.Repositories.Interface;
using RepositoryLayer.Utils.RabbitMQPublisher;
using Server.Middleware;
using Server.Profiles;
using ServiceLayer.Interfaces.CommentService;
using ServiceLayer.Interfaces.ImageObjService;
using ServiceLayer.Interfaces.IPostService;
using ServiceLayer.Interfaces.PostViewService;
using ServiceLayer.Interfaces.SavedInfoService;
using ServiceLayer.Interfaces.SessionService;
using ServiceLayer.Interfaces.StaticStorageService;
using ServiceLayer.Interfaces.UserService;
using ServiceLayer.Interfaces.UtilService;
using ServiceLayer.Services.CommentService;
using ServiceLayer.Services.ImageObjService;
using ServiceLayer.Services.PostService;
using ServiceLayer.Services.PostViewService;
using ServiceLayer.Services.SavedEGOInfoService.cs;
using ServiceLayer.Services.SavedIDInfoService;
using ServiceLayer.Services.SessionServices;
using ServiceLayer.Services.StaticStorageService;
using ServiceLayer.Services.UserServices;
using ServiceLayer.Services.UtilServices;
using ServiceLayer.Services.UtilServices.RabbitMQService;


Env.Load();


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddDataProtection();

builder.Services.AddCors(options=>
{
    options.AddPolicy("AllowOrigin",
                    policy=>
                    {
                        policy.WithOrigins(Environment.GetEnvironmentVariable("FrontendUri"))
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
if(Environment.GetEnvironmentVariable("MODE").Equals("Published")) builder.Services.AddDbContext<ServerDbContext>(options =>options.UseNpgsql(Environment.GetEnvironmentVariable("RemoteConnection"), builder =>
        {
            builder.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
        }));
else builder.Services.AddDbContext<ServerDbContext>(options =>options.UseNpgsql(Environment.GetEnvironmentVariable("DefaultConnection")));
builder.Services.AddSingleton<RabbitMQUploadingImagePublisher>();
builder.Services.AddHostedService<RabbitMQUploadingImageConsumerService>();
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
builder.Services.AddTransient<IUserService,UserService>();
builder.Services.AddTransient<IOAuthService,OAuthService>();
builder.Services.AddTransient<ISessionService,SessionService>();
builder.Services.AddTransient<ICookieSessionService,CookieSessionService>();
builder.Services.AddTransient<IUploadService,CloudinaryService>();
builder.Services.AddTransient<IDeleteService,CloudinaryService>();
builder.Services.AddTransient<IImageObjService,ImageObjService>();
builder.Services.AddTransient<ISavedInfoService<SavedIDInfo>,SavedIDInfoService>();
builder.Services.AddTransient<ISavedInfoService<SavedEGOInfo>,SavedEGOInfoService>();
builder.Services.AddTransient<IPostService,PostService>();
builder.Services.AddTransient<ICommentService,CommentService>();
builder.Services.AddTransient<IPostViewService,PostViewService>();
builder.Services.AddHostedService<BackgroundHostedService>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(typeof(SaveInfoProfile));
builder.Services.AddLogging();

if(!Environment.GetEnvironmentVariable("LISTEN_ON").IsNullOrEmpty())builder.WebHost.UseUrls(Environment.GetEnvironmentVariable("LISTEN_ON"));

var app = builder.Build();

// if(Environment.GetEnvironmentVariable("MODE").Equals("Published"))
// {
//     using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
//     {
//         var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();
//         var db = serviceScope.ServiceProvider.GetRequiredService<ServerDbContext>().Database;

//         logger.LogInformation("Migrating database...");

//         while (!db.CanConnect())
//         {
//             logger.LogInformation("Database not ready yet; waiting...");
//             Thread.Sleep(1000);
//         }

//         try
//         {
//             serviceScope.ServiceProvider.GetRequiredService<ServerDbContext>().Database.Migrate();
//             logger.LogInformation("Database migrated successfully.");
//         }
//         catch (Exception ex)
//         {
//             logger.LogError(ex, "An error occurred while migrating the database.");
//         }
//     }
// }


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/OAuth/oauth2/login"), app =>
{
    app.UseLoginMiddleware();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/OAuth/oauth2/logout"), app =>
{
    app.UseLoginMiddleware();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/User"), app =>
{
    app.UseLoginMiddleware();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/SaveIDInfo"), app =>
{
    app.UseLoginMiddleware();
});

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

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/SaveEGOInfo"), app =>
{
    app.UseLoginMiddleware();
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

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/Post"), app =>
{
    app.UseLoginMiddleware();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/Post/create"), app =>
{
    app.UseCheckPostUrlMiddlewareExtension();
});

app.UseWhen(ctx=>ctx.Request.Path.StartsWithSegments("/API/Comment"), app =>
{
    app.UseLoginMiddleware();
});


app.Run();
