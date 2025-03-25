using Newtonsoft.Json;
using RepositoryLayer.Utils.Obj;
using ServiceLayer.Interfaces.UtilService;

namespace ServiceLayer.Services.UtilServices
{
    public class OAuthService :IOAuthService
    {
        private readonly HttpClient _client;


        public OAuthService(HttpClient client)
        {
            _client = client;
        }

        public async Task<UserOAuthReponse?> ExchangeTokenInfoAsync(string code)
        {
            try
            {
                var endpoint = Environment.GetEnvironmentVariable("TokenEndpoint");

                var request = await _client.GetStringAsync(endpoint+code);
                return JsonConvert.DeserializeObject<UserOAuthReponse>(request);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error:");
                Console.WriteLine(ex.Message);
                return null;
            }
            
        }
    }


}