using System.Net;
using System.Text.Json;
using Server.Interface.Repositories;
using Server.Interface.UtilInterfaces;

namespace Server.Util
{
    public class MiscUtil
    {
        public static async Task<bool> CheckFormUploadSaveFile(HttpContext context, List<IFormContextValidation> validations)
        {
            if (context.Request.Method == "POST" && context.Request.HasFormContentType)
            {
                var form = await context.Request.ReadFormAsync();
                foreach (var validation in validations)
                {
                    if(!validation.Validate(form))
                    {
                        context.Response.StatusCode = (int)validation.StatusCode;
                        await context.Response.WriteAsync(JsonSerializer.Serialize(ApiResponse<string>.Fail(validation.ErrMess)));
                        return false;
                    }
                }
            } 
            return true;
        }

        public static async Task GenerateErrorMsg(HttpContext context,string errMsg, HttpStatusCode statusCode)
        {
            context.Response.StatusCode = (int)statusCode;
            await context.Response.WriteAsync(JsonSerializer.Serialize(ApiResponse<string>.Fail(errMsg)));
        }
    }
}