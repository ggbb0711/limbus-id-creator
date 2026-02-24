using System.Text.RegularExpressions;

namespace Server.Util
{
    public class FileHelper
    {
        public static async Task<string> ConvertToBase64Async(IFormFile file,Action<string>? cb = null)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                cb?.Invoke("data:image/png;base64," + Convert.ToBase64String(fileBytes));
                return "data:image/png;base64,"+Convert.ToBase64String(fileBytes);
            }
        }

        public static async Task<string> ConvertToBase64Async(string url,Action<string>? cb = null)
        {
            if (Uri.TryCreate(url,UriKind.RelativeOrAbsolute,out _))
            {
                return "";
            }

            using (HttpClient client = new HttpClient())
            {
                var base64String = "data:image/png;base64," + Convert.ToBase64String(await client.GetByteArrayAsync(url));
                cb?.Invoke(base64String);
                return base64String;
            }
        }

        public static async Task<byte[]> ConvertToByteArray(string url)
        {
            using (var webClient = new HttpClient()) 
            { 
                byte[] imageBytes = await webClient.GetByteArrayAsync(url);
                return imageBytes;
            }
        }

        public static async Task<long> GetImageSizeFromUrl(string url)
        {
            using (HttpClient client = new HttpClient())
            {
                // Send a HEAD request to get the headers
                Console.WriteLine("Url: "+url);
                if(url.StartsWith("https://res.cloudinary.com/")){
                    url = url.Replace("/q_35/f_auto","");
                }
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Head, url);
                HttpResponseMessage response = await client.SendAsync(request);

                response.EnsureSuccessStatusCode();

                // Get the Content-Length header value
                if (response.Content.Headers.ContentLength.HasValue)
                {
                    return response.Content.Headers.ContentLength.Value;
                }
                else
                {
                    return -1;
                }
            }
        }

        public static bool IsBase64String(string base64)
        {
            if (string.IsNullOrEmpty(base64))
            {
                return false;
            }
            

            // Base64 strings must be divisible by 4
            if (base64.Length % 4 != 0)
            {
                return false;
            }

            // Check if the string matches the base64 pattern
            string base64Pattern = @"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$";
            if (!Regex.IsMatch(base64, base64Pattern))
            {
                return false;
            }

            try
            {
                Convert.FromBase64String(base64);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        public static async Task<bool> CheckUrlSize(string url,long maxFileSize)
        {
            //For url
            if(Uri.TryCreate(url,UriKind.Absolute, out _) && !url.StartsWith("/Images"))
            {
                var urlSize = await FileHelper.GetImageSizeFromUrl(url);
                return urlSize <= maxFileSize && urlSize>0;
            }

            //For base 64
            if(FileHelper.IsBase64String(url.Replace("data:image/png;base64,","")))
            {
                var urlSize = Convert.FromBase64String(url).Length; 
                return urlSize <=maxFileSize && urlSize>0;
            }
            return true;
        }
    }
}
