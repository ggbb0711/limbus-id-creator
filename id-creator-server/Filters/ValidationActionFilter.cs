using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;
using ValidationException = Server.Util.ApiException.ValidationException;

namespace Server.Filters
{
    public class ValidationActionFilter(IServiceProvider serviceProvider) : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument == null) continue;

                var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
                if (serviceProvider.GetService(validatorType) is not IValidator validator) continue;

                var validationContext = new ValidationContext<object>(argument);
                var result = await validator.ValidateAsync(validationContext);
                if (!result.IsValid)
                    throw new ValidationException("Validation failed" + result.ToString());
            }

            await next();
        }
    }
}
