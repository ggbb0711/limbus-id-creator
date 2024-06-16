using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Server.Util
{
    public class FileHelper
    {
        public static async Task<string> ConvertToBase64Async(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                return "data:image/png;base64,"+Convert.ToBase64String(fileBytes);
            }
        }
    }
}
