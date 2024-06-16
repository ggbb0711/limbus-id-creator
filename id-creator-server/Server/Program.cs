using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interface.Repositories;
using Server.Interface.ServiceInterface.SessionInterface;
using Server.Interface.ServiceInterface.UploadService;
using Server.Interface.ServiceInterface.UserService;
using Server.Interface.ServiceInterface.UtilService;
using Server.Middleware;
using Server.Repositories;
using Server.Services;
using Server.Services.UtilServices;

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
builder.Services.AddDbContext<ServerDbContext>(options =>options.UseLazyLoadingProxies().UseNpgsql(Environment.GetEnvironmentVariable("DefaultConnection")));
builder.Services.AddSingleton<JobQueue>();
builder.Services.AddScoped<IUserRepository,UserRepository>();
builder.Services.AddScoped<ISessionRepository,SessionRepository>();
builder.Services.AddTransient<IUserService,UserService>();
builder.Services.AddTransient<IOAuthService,OAuthService>();
builder.Services.AddTransient<ISessionService,SessionService>();
builder.Services.AddTransient<ICookieSessionService,CookieSessionService>();
builder.Services.AddTransient<IUploadService,CloudinaryUploadService>();
builder.Services.AddHostedService<BackgroundHostedService>();
builder.Services.AddHostedService<QueuedHostedService>();
builder.Services.AddAutoMapper(typeof(Program));

var app = builder.Build();


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

app.Run();
