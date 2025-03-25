using System.Net;
using System.Text.Json;
using AutoMapper;
using Newtonsoft.Json;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Request.SavedInfo;
using ServiceLayer.DTOs.Request.SavedInfo.SavedEgo;
using ServiceLayer.Services.UtilServices;
using ServiceLayer.Util;

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

                foreach(var offenseSkill in saveIDInfo.SavedEgo.Skill.OffenseSkills)
                {
                    if(!await FileHelper.CheckUrlSize(offenseSkill.ImageAttach.Url,100000))
                    {
                        await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }

                foreach(var defenseSkill in saveIDInfo.SavedEgo.Skill.DefenseSkills)
                {
                    if(!await FileHelper.CheckUrlSize(defenseSkill.ImageAttach.Url,100000))
                    {
                        await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                        return;
                    }
                }

                foreach(var customEffect in saveIDInfo.SavedEgo.Skill.CustomEffects)
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