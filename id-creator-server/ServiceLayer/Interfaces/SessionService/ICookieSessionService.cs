


using Microsoft.AspNetCore.Http;

namespace ServiceLayer.Interfaces.SessionService
{
    public interface ICookieSessionService
    {
        void AddSessionCookie(HttpResponse res, Guid sessionId, DateTime expireDate);
        string GetSessionCookie(HttpRequest req);
        void DeleteSessionCookie(HttpRequest req, HttpResponse res);
    }
}