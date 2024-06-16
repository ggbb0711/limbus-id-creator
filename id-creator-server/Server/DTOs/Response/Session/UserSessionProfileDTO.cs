


namespace Server.DTOs.Response.Users
{
    public class UserSessionProfileDTO
    {
        public Guid Id{get; set;}
        public string UserEmail { get; set; } = "";
        public string UserName {get; set;} = "";
        public string UserIcon {get; set;} = "";
    }
}