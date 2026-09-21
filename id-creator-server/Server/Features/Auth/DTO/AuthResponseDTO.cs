namespace Server.Features.Auth.DTO
{
    public class AuthResponseDTO(string accessToken, UserSessionProfileDTO userSessionProfile)
    {
        public string AccessToken { get; set; } = accessToken;
        public UserSessionProfileDTO UserSessionProfile { get; set; } = userSessionProfile;
    }
}
