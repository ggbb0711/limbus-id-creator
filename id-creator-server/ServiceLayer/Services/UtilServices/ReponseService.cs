
using RepositoryLayer.Utils.UtilInterfaces;

namespace ServiceLayer.Services.UtilServices
{
    public class ResponseService<ResponseType> : IResponse<ResponseType>
    {
        public ResponseType? Response { get; set; }
        public string msg  { get; set; } = "";        
    }
}