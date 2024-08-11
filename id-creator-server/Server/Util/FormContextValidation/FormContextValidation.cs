using System.Net;
using Server.Interface.Repositories;

namespace Server.Util.FormContextValidation
{
    public abstract class FormContextValidation:IFormContextValidation
    {
        public string FieldName {get;set;} = "";
        public string ErrMess {get;set;} = "";
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