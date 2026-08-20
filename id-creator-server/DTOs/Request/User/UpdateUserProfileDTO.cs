namespace Server.DTOs.Request.User
{
    public class UpdateUserProfileDTO
    {
        public string UserName {get; set;} = "";
        public IFormFile? UserIconFile {get; set;}
    }
}