using Server.DTOs.Response.Session;
using Server.Models;

namespace Server.DTOs.Response.Auth
{
    public class AuthResponseDTO(string accessToken, UserSessionProfileDTO userSessionProfile)
    {
        public string AccessToken { get; set; } = accessToken;
        public UserSessionProfileDTO UserSessionProfile { get; set; } = userSessionProfile;
    }
}