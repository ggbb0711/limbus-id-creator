using System.Net;
using System.Text;
using AutoMapper;
using Newtonsoft.Json;
using Server.DTOs.Requests.Post;
using Server.Util;

namespace Server.Middleware
{
    public class CheckPostUrlMiddleware 
    {
        private readonly RequestDelegate _next;

        public CheckPostUrlMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IMapper mapper)
        {
            context.Request.EnableBuffering();

            // Read the request body
            using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true))
            {
                var body = await reader.ReadToEndAsync();

                var newPost = JsonConvert.DeserializeObject<PostRequestDTO>(body);
                if(newPost == null)
                {
                    await MiscUtil.GenerateErrorMsg(context,"Post data is not formatted correctly",HttpStatusCode.BadRequest);
                    return;
                }

                foreach(var image in newPost.ImagesAttach)
                {
                    if(!await FileHelper.CheckUrlSize(image, 7000000))
                    {
                        await MiscUtil.GenerateErrorMsg(context,"Post images must be <= 7mb",HttpStatusCode.BadRequest);
                        return;
                    };
                }
                // Reset the request body stream position so the next middleware can read it
                context.Request.Body.Position = 0;
            }

            // Call the next middleware in the pipeline
            await _next(context);
        }

    }
    public static class CheckPostUrlMiddlewareExtension
    {
        public static IApplicationBuilder UseCheckPostUrlMiddlewareExtension(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CheckPostUrlMiddleware>();
        }
    }
}