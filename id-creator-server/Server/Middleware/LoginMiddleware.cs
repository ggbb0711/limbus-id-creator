using ServiceLayer.Interfaces.SessionService;

namespace Server.Middleware
{
    public class LoginMiddleware 
    {
        private readonly RequestDelegate _next;

        public LoginMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ICookieSessionService cookieSessionService, ISessionService sessionService)
        {
            var sessionId = cookieSessionService.GetSessionCookie(context.Request);
            if(sessionId != null)
            {
                try
                {
                    var session = await sessionService.GetSession(Guid.Parse(sessionId));
                    if(session != null && DateTime.Now< session.Expired)
                    {
                        context.Items["Session"] = session;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            
            await _next(context);
        }
    }

    public static class LoginMiddlewareExtension
    {
        public static IApplicationBuilder UseLoginMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<LoginMiddleware>();
        }
    }
}