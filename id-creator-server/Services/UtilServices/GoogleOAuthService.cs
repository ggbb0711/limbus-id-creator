

using System.Text.Json.Serialization;
using Google.Apis.Auth;
using Server.Interface.ServiceInterface.UtilService;
using Server.Util.Config;

namespace Server.Services.UtilServices
{
    public class GoogleOAuthService(HttpClient client, EnvironmentVariables env) : IOAuthService<GoogleJsonWebSignature.Payload>
    {
        public class GoogleTokenResponse
        {
            [JsonPropertyName("id_token")] public string IdToken { get; set; } = "";
            [JsonPropertyName("access_token")] public string AccessToken { get; set; } = "";
            [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }
        }
        public async Task<GoogleJsonWebSignature.Payload?> ExchangeTokenInfoAsync(string code)
        {
            var tokenResponse = await client.PostAsync("https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["code"] = code,
                    ["client_id"] = env.GoogleClientId,
                    ["client_secret"] = env.GoogleClientSecret,
                    ["redirect_uri"] = env.GoogleRedirectUri,
                    ["grant_type"] = "authorization_code",
                })
            );

            if(!tokenResponse.IsSuccessStatusCode) return null;
            
            var payload = await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>();
            return await GoogleJsonWebSignature.ValidateAsync(payload!.IdToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [env.GoogleClientId]
            });
        }
    }
}