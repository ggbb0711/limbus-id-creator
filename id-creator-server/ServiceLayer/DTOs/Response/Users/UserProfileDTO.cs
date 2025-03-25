


namespace ServiceLayer.DTOs.Response.Users
{
    public class UserProfileDTO
    {
        public Guid Id{get; set;}
        public string UserEmail { get; set; } = "";
        public string UserName {get; set;} = "";
        public string UserIcon {get; set;} = "";
        public string CreatedAt { get; set; }
        public Boolean owned { get; set; } = false;
    }
}