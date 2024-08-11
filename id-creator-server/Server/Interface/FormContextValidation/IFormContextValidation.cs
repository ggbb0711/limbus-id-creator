

using System.Net;
using Server.Models;

namespace Server.Interface.Repositories
{
    public interface IFormContextValidation
    {
        public string FieldName {get;set;} 
        public string ErrMess {get;set;} 
        public HttpStatusCode StatusCode {get;set;}
        bool Validate(IFormCollection form);
    }
}