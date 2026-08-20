


namespace Server.DTOs.Response.Users
{
    public class UserProfileResponseDTO
    {
        public Guid Id{get; set;}
        public string UserEmail { get; set; } = "";
        public string UserName {get; set;} = "";
        public string UserIcon {get; set;} = "";
        public string CreatedAt { get; set; }
        public bool Owned { get; set; } = false;
    }
}