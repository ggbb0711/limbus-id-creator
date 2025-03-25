using System.Net;
using Microsoft.AspNetCore.Http;

namespace ServiceLayer.Util.FormContextValidation
{
    public abstract class FormContextValidation: IFormContextValidation
    {
        public string FieldName {get;set;} = String.Empty;
        public string ErrMess {get;set;} = String.Empty;
        public HttpStatusCode StatusCode {get;set;}
        public FormContextValidation(string fieldName, string errMess, HttpStatusCode statusCode)
        {
            FieldName = fieldName;
            ErrMess = errMess;
            StatusCode = statusCode;
        }
        public abstract bool Validate(IFormCollection form);
    }
}