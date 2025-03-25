

using System.Net;
using Microsoft.AspNetCore.Http;

namespace ServiceLayer.Util.FormContextValidation
{
    public interface IFormContextValidation
    {
        public string FieldName {get;set;} 
        public string ErrMess {get;set;} 
        public HttpStatusCode StatusCode {get;set;}
        bool Validate(IFormCollection form);
    }
}