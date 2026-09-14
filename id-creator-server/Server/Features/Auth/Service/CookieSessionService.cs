



using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Server.Shared.Config;

namespace Server.Features.Auth.Service
{
    public class CookieSessionService:ICookieSessionService
    {
        private readonly IDataProtector _dataProtector;

        public CookieSessionService(IDataProtectionProvider dataProtector, EnvironmentVariables env)
        {
            _dataProtector = dataProtector.CreateProtector(env.CookieSessionProtectorSecret);
        }

        public void AddSessionCookie(HttpResponse res,Guid sessionId,DateTime expireDate)
        {
            res.Cookies.Delete("Session-Cookie");

            var cookie = new CookieHeaderValue("Session-id",_dataProtector.Protect(sessionId.ToString()));
            var cookieOptions = new CookieOptions
            {
                Secure = true,
                HttpOnly = true,
                Expires = expireDate,
                SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                Path = "/API/OAuth/refresh"
            };

            res.Cookies.Append("Session-Cookie",cookie.ToString(),cookieOptions);

            return;
        }

        public string GetSessionCookie(HttpRequest req)
        {
            var sessionCookie = req.Cookies["Session-Cookie"];
            string sessionId = "";
            try
            {
                if(!sessionCookie.IsNullOrEmpty()) sessionId = _dataProtector.Unprotect(sessionCookie!.Split('=')[1]);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                sessionId = "";
            }

            return sessionId;
        }

        public void DeleteSessionCookie(HttpRequest req, HttpResponse res)
        {
            if(!req.Cookies["Session-Cookie"].IsNullOrEmpty())
            {
                res.Cookies.Delete("Session-Cookie");
            }
            return;
        }

    }
}
