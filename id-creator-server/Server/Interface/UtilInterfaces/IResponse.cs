


namespace Server.Interface.UtilInterfaces
{
    public interface IResponse<ResponseType>
    {
        public ResponseType? Response { get; set; }
        public string msg { get; set; }
    }
}