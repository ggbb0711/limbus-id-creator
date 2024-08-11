using System;
using System.Collections;
using System.Net;
using System.Reflection;
using System.Text.Json;
using Server.Interface.Repositories;
using Server.Services;
using Server.Util.FormContextValidation;

namespace Server.Util
{
    public class MiscUtil
    {
        public static void CopyProperties<T>(T source, T target)
        {
            if (source == null || target == null)
            {
                throw new ArgumentNullException("Source or/and Target is null");
            }

            Type type = typeof(T);
            PropertyInfo[] properties = type.GetProperties();

            foreach (PropertyInfo property in properties)
            {
                if (property.CanWrite)
                {
                    object sourceValue = property.GetValue(source, null);

                    if (sourceValue == null)
                    {
                        property.SetValue(target, null, null);
                    }
                    else if (property.PropertyType.IsValueType || property.PropertyType == typeof(string))
                    {
                        property.SetValue(target, sourceValue, null);
                    }
                    else if (typeof(IEnumerable).IsAssignableFrom(property.PropertyType))
                    {
                        // Handle collections
                        Type itemType = property.PropertyType.IsArray ? property.PropertyType.GetElementType() : property.PropertyType.GetGenericArguments()[0];
                        IList list = (IList)Activator.CreateInstance(property.PropertyType);
                        foreach (var item in (IEnumerable)sourceValue)
                        {
                            object itemCopy = Activator.CreateInstance(itemType);
                            CopyProperties(item, itemCopy);
                            list.Add(itemCopy);
                        }
                        property.SetValue(target, list, null);
                    }
                    else
                    {
                        // Handle nested objects
                        object targetValue = Activator.CreateInstance(property.PropertyType);
                        CopyProperties(sourceValue, targetValue);
                        property.SetValue(target, targetValue, null);
                    }
                }
            }
        }

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
                        await context.Response.WriteAsync(JsonSerializer.Serialize(new ResponseService<string?>()
                        {
                            msg=validation.ErrMess
                        }));
                        return false;
                    }
                }
            } 
            return true;
        }

        public static async Task GenerateErrorMsg(HttpContext context,string errMsg, HttpStatusCode statusCode)
        {
            context.Response.StatusCode = (int)statusCode;
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new ResponseService<string?>()
            {
                msg = errMsg
            }));
        }
    }
}