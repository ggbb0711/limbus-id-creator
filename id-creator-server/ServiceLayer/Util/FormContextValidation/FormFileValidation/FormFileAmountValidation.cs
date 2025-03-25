using System.Net;
using Microsoft.AspNetCore.Http;

namespace ServiceLayer.Util.FormContextValidation.FormFileValidation
{
    public class FormFileAmountValidation : FormContextValidation
    {
        public int _maxAmount = 0;
        public int _minAmount = 0;
        public FormFileAmountValidation(string fieldName, string errMess, HttpStatusCode statusCode,int minAmount, int maxAmount) : base(fieldName, errMess, statusCode)
        {
            _maxAmount = maxAmount;
            _minAmount = minAmount;
        }

        public override bool Validate(IFormCollection form)
        {
            var overSizedFiles =form.Files.Where(f=>f.Name.Equals(FieldName)).ToList(); 
            if (overSizedFiles.Count<=_maxAmount
            &&overSizedFiles.Count>=_minAmount) return true;
            return false;
        }
    }
}