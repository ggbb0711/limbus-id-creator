


using Server.Interface;
using Server.Interface.UtilInterfaces;

namespace Server.Services
{
    public class ResponseService<ResponseType> : IResponse<ResponseType>
    {
        public ResponseType? Response { get; set; }
        public string msg  { get; set; } = "";        
    }
}