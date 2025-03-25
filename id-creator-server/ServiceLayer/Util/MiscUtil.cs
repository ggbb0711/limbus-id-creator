using System.Collections;
using System.Net;
using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using ServiceLayer.Services.UtilServices;
using ServiceLayer.Util.FormContextValidation;

namespace ServiceLayer.Util
{
    public class MiscUtil
    {
        public static void CopyProperties<T>(T source, T target)
        {
            if (source == null || target == null)
            {
                throw new ArgumentNullException("Source or/and Target is null");
            }

            // Dictionary to keep track of already visited objects
            var visited = new Dictionary<object, object>();
            CopyProperties(source, target, visited);
        }

        private static void CopyProperties<T>(T source, T target, Dictionary<object, object> visited)
        {
            Type type = typeof(T);
            PropertyInfo[] properties = type.GetProperties();

            // Mark the source and target as visited
            visited[source] = target;

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
                        var itemType = property.PropertyType.IsArray ? property.PropertyType.GetElementType() : property.PropertyType.GetGenericArguments()[0];
                        IList list = (IList)Activator.CreateInstance(property.PropertyType);
                        foreach (var item in (IEnumerable)sourceValue)
                        {
                            var itemCopy = Activator.CreateInstance(itemType);

                            // Check if item is already visited
                            if (visited.TryGetValue(item, out var existingItemCopy))
                            {
                                list.Add(existingItemCopy);
                            }
                            else
                            {
                                CopyProperties(item, itemCopy, visited);
                                list.Add(itemCopy);
                            }
                        }
                        property.SetValue(target, list, null);
                    }
                    else
                    {
                        // Handle nested objects
                        object targetValue = Activator.CreateInstance(property.PropertyType);

                        // Check if target value is already visited
                        if (visited.TryGetValue(sourceValue, out var existingTargetValue))
                        {
                            property.SetValue(target, existingTargetValue, null);
                        }
                        else
                        {
                            CopyProperties(sourceValue, targetValue, visited);
                            property.SetValue(target, targetValue, null);
                            visited[sourceValue] = targetValue;
                        }
                    }
                }
            }
        }

        public static async Task<bool> CheckFormUploadSaveFile(HttpContext context, List<IFormContextValidation> validations)
        {
            if (context.Request.Method != "POST" || !context.Request.HasFormContentType) return true;
            var form = await context.Request.ReadFormAsync();
            foreach (var validation in validations.Where(validation => !validation.Validate(form)))
            {
                context.Response.StatusCode = (int)validation.StatusCode;
                await context.Response.WriteAsync(JsonSerializer.Serialize(new ResponseService<string?>()
                {
                    msg=validation.ErrMess
                }));
                return false;
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