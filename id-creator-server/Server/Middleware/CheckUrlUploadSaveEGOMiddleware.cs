using System.Net;
using System.Text.Json;
using AutoMapper;
using Newtonsoft.Json;
using Server.DTOs.Requests.SavedInfo;
using Server.DTOs.Requests.SavedInfo.SavedEgo;
using Server.Models;
using Server.Services;
using Server.Util;

namespace Server.Middleware
{
    public class CheckUrlUploadSaveEGOMiddleware 
    {
        private readonly RequestDelegate _next;

        public CheckUrlUploadSaveEGOMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IMapper mapper)
        {
            var form = await context.Request.ReadFormAsync();
            if( form != null)
            {
                string? SaveData = form["SaveData"];
                if( SaveData == null)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new ResponseService<string?>()
                    {
                        msg="Save data missing",
                    }));
                    
                    return;
                }
                var saveIDInfoRequestDTO = JsonConvert.DeserializeObject<SavedInfoRequestDTO<SavedEgoRequestDTO>>(SaveData);
                if(saveIDInfoRequestDTO==null)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new ResponseService<string?>()
                    {
                        msg="Save data is not formatted correctly",
                    }));    
                    return;
                }

                var saveIDInfo = mapper.Map<SavedEGOInfo>(saveIDInfoRequestDTO);
                var splashArtUrl = saveIDInfo.SavedEgo.SplashArt.Url;
                var sinnerIconUrl = saveIDInfo.SavedEgo.SinnerIcon.Url;

                if(!await CheckUrlSize(splashArtUrl,1200000))
                {
                    await GenerateErrorMsg(context,"Splash art url size must be <= 1.2mb",HttpStatusCode.BadRequest);
                    return;
                }

                if(!await CheckUrlSize(sinnerIconUrl,80000))
                {
                    await GenerateErrorMsg(context,"Sinner icon url size <= 80kb",HttpStatusCode.BadRequest);
                    return;
                }

                foreach(var offenseSkill in saveIDInfo.SavedEgo.Skill.OffenseSkills)
                {
                    if(!await CheckUrlSize(offenseSkill.ImageAttach.Url,80000))
                    {
                        await GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 80kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }

                foreach(var defenseSkill in saveIDInfo.SavedEgo.Skill.DefenseSkills)
                {
                    if(!await CheckUrlSize(defenseSkill.ImageAttach.Url,80000))
                    {
                        await GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 80kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }

                foreach(var customEffect in saveIDInfo.SavedEgo.Skill.CustomEffects)
                {
                    if(!await CheckUrlSize(customEffect.ImageAttach.Url,80000))
                    {
                        await GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 80kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }
                context.Items["SaveData"] = saveIDInfo;
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }

        //Url must start with the cloudinary url
        //and check the length of the file of the url
        private async Task<bool> CheckUrlSize(string url,long maxFileSize)
        {
            if(Uri.TryCreate(url,UriKind.Absolute, out _))
            {
                var urlSize = await FileHelper.GetImageSizeFromUrl(url);
                return urlSize <= maxFileSize && urlSize>0;
            }
            return true;
        }

        private async Task GenerateErrorMsg(HttpContext context,string errMsg, HttpStatusCode statusCode)
        {
            context.Response.StatusCode = (int)statusCode;
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new ResponseService<string?>()
            {
                msg = errMsg
            }));
        }
    }

    public static class CheckUrlUploadSaveEGOMiddlewareExtension
    {
        public static IApplicationBuilder UseCheckUrlUploadSaveEGOMiddlewareExtension(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CheckUrlUploadSaveEGOMiddleware>();
        }
    }
}