using System.Net;
using Microsoft.AspNetCore.Http;

namespace ServiceLayer.Util.FormContextValidation.FormFileValidation
{
    public class FormFileSizeValidation : FormContextValidation
    {
        public double _maxSize = 0;
        public FormFileSizeValidation(string fieldName, string errMess, HttpStatusCode statusCode, double maxSize) : base(fieldName, errMess, statusCode)
        {
            _maxSize = maxSize;
        }

        public override bool Validate(IFormCollection form)
        {
            var overSizedFiles =form.Files.Where(f=>f.Name.Equals(FieldName)&&f.Length>_maxSize).ToList(); 
            if (overSizedFiles.Count>0) return false;
            return true;
        }
    }
}