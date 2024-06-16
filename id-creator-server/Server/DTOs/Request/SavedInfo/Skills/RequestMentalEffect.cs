namespace Server.DTOs.Requests.SavedInfo.Skills
{
    public class RequestMentalEffect
    {
        public string InputId { get; set; } = Guid.NewGuid().ToString();
        public string effect { get; set; }="";
        public string type { get; set; } = "MentalEffect";
    }
}