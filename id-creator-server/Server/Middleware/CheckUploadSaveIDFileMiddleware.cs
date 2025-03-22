using System.Net;
using System.Text.Json;
using Server.Interface.Repositories;
using Server.Util;
using Server.Util.FormContextValidation.FormFileValidation;

namespace Server.Middleware
{
    public class CheckUploadSaveIDFileMiddleware 
    {
        private readonly RequestDelegate _next;

        public CheckUploadSaveIDFileMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if(! await MiscUtil.CheckFormUploadSaveFile(context,new List<IFormContextValidation>()
                {
                    new FormFileSizeValidation("thumbnailImage","Thumbnail image must be <= 10mb",HttpStatusCode.BadRequest,1e+7)
                }))
            return;

            if(! await MiscUtil.CheckFormUploadSaveFile(context,new List<IFormContextValidation>()
                {
                    new FormFileSizeValidation("splashArtImg","Splash art must be <= 4mb",HttpStatusCode.BadRequest,4000000)
                }))
            return;

            if(! await MiscUtil.CheckFormUploadSaveFile(context,new List<IFormContextValidation>()
                {
                   new FormFileSizeValidation("sinnerIcon","Sinner icon must be <= 100kb",HttpStatusCode.BadRequest,100000) 
                }))
            return;

            if(! await MiscUtil.CheckFormUploadSaveFile(context,new List<IFormContextValidation>()
                {
                    new FormFileSizeValidation("skillImages","Skill icon and custom effect icon must be <= 100kb",HttpStatusCode.BadRequest,100000),
                    new FormFileAmountValidation("skillImages","Can only upload less or equal than 20 skill images and custom effect icon",HttpStatusCode.BadRequest,0,20)
                }))
            return;

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }
    }

    public static class CheckUploadSaveIDFileMiddlewareExtension
    {
        public static IApplicationBuilder UseCheckUploadSaveIDFileMiddlewareExtension(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CheckUploadSaveIDFileMiddleware>();
        }
    }
}