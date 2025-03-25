using System.Net;
using System.Text.Json;
using AutoMapper;
using Newtonsoft.Json;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Request.SavedInfo;
using ServiceLayer.DTOs.Request.SavedInfo.SavedID;
using ServiceLayer.Services.UtilServices;
using ServiceLayer.Util;

namespace Server.Middleware
{
    public class CheckUrlUploadSaveIDMiddleware 
    {
        private readonly RequestDelegate _next;

        public CheckUrlUploadSaveIDMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IMapper mapper)
        {
            var form = await context.Request.ReadFormAsync();
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
                var saveIDInfoRequestDTO = JsonConvert.DeserializeObject<SavedInfoRequestDTO<SavedIDRequestDTO>>(SaveData);
                if(saveIDInfoRequestDTO==null)
                {
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new ResponseService<string?>()
                    {
                        msg="Save data is not formatted correctly",
                    }));    
                    return;
                }

                var saveIDInfo = mapper.Map<SavedIDInfo>(saveIDInfoRequestDTO);
                var splashArtUrl = saveIDInfo.SavedId.SplashArt.Url;
                var sinnerIconUrl = saveIDInfo.SavedId.SinnerIcon.Url;

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

                foreach(var offenseSkill in saveIDInfo.SavedId.Skill.OffenseSkills)
                {
                    if (await FileHelper.CheckUrlSize(offenseSkill.ImageAttach.Url, 100000)) continue;
                    await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                    return;
                }

                foreach(var defenseSkill in saveIDInfo.SavedId.Skill.DefenseSkills)
                {
                    if (await FileHelper.CheckUrlSize(defenseSkill.ImageAttach.Url, 100000)) continue;
                    await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                    return;
                }

                foreach(var customEffect in saveIDInfo.SavedId.Skill.CustomEffects)
                {
                    if (await FileHelper.CheckUrlSize(customEffect.ImageAttach.Url, 100000)) continue;
                    await MiscUtil.GenerateErrorMsg(context,"Skill icon and custom effect icon size must be <= 100kb",HttpStatusCode.BadRequest);
                    return;
                }
                context.Items["SaveData"] = saveIDInfo;
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }

    }

    public static class CheckUrlUploadSaveIDMiddlewareExtension
    {
        public static IApplicationBuilder UseCheckUrlUploadSaveIDMiddlewareExtension(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CheckUrlUploadSaveIDMiddleware>();
        }
    }
}