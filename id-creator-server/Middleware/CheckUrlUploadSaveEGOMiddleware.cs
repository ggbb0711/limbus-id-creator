using System.Net;
using AutoMapper;
using Newtonsoft.Json;
using Server.DTOs.Requests.SavedInfo;
using Server.DTOs.Requests.SavedInfo.SavedEgo;
using Server.Models;
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
                    await MiscUtil.GenerateErrorMsg(context,"Save data missing",HttpStatusCode.BadRequest);
                    return;
                }
                var saveIDInfoRequestDTO = JsonConvert.DeserializeObject<SavedInfoRequestDTO<SavedEgoRequestDTO>>(SaveData);
                if(saveIDInfoRequestDTO==null)
                {
                    await MiscUtil.GenerateErrorMsg(context,"Save data is not formatted correctly",HttpStatusCode.BadRequest);
                    return;
                }

                var saveIDInfo = mapper.Map<SavedEGOInfo>(saveIDInfoRequestDTO);
                var splashArtUrl = saveIDInfo.Saved.SplashArt.Url;
                var sinnerIconUrl = saveIDInfo.Saved.SinnerIcon.Url;

                if(!await FileHelper.CheckUrlSize(splashArtUrl,4000000))
                {
                    await MiscUtil.GenerateErrorMsg(context,"Splash art url size must be <= 4mb",HttpStatusCode.BadRequest);
                    return;
                }

                if(!await FileHelper.CheckUrlSize(sinnerIconUrl,100000))
                {
                    await MiscUtil.GenerateErrorMsg(context,"Sinner icon url size <= 100kb",HttpStatusCode.BadRequest);
                    return;
                }

                foreach(var offenseSkill in saveIDInfo.Saved.Skill.OffenseSkills)
                {
                    if(!await FileHelper.CheckUrlSize(offenseSkill.ImageAttach.Url,100000))
                    {
                        await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }

                foreach(var defenseSkill in saveIDInfo.Saved.Skill.DefenseSkills)
                {
                    if(!await FileHelper.CheckUrlSize(defenseSkill.ImageAttach.Url,100000))
                    {
                        await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }

                foreach(var customEffect in saveIDInfo.Saved.Skill.CustomEffects)
                {
                    if(!await FileHelper.CheckUrlSize(customEffect.ImageAttach.Url,100000))
                    {
                        await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }
                context.Items["SaveData"] = saveIDInfo;
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
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