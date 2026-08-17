

using Microsoft.AspNetCore.Authentication.OAuth;
using Newtonsoft.Json;
using Server.Interface.ServiceInterface.UtilService;
using Server.Models;
using Server.Util.Config;

namespace Server.Services
{
    public class OAuthService(HttpClient client, EnvironmentVariables env) : IOAuthService
    {
        public async Task<UserOAuthReponse?> ExchangeTokenInfoAsync(string code)
        {
            try
            {
                var endpoint = env.TokenEndpoint;

                var request = await client.GetStringAsync(endpoint+code);
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