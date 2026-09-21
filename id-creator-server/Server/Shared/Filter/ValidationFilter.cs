using System.Reflection;
using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;
using ValidationException = Server.Shared.Exception.ValidationException;

namespace Server.Shared.Filter
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class ValidationFilterAttribute<T> : Attribute, IAsyncActionFilter where T : class
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();

            if (validator is not null)
            {
                var model = FindModel(context.ActionArguments.Values);

                if (model is not null)
                {
                    var validationResult = await validator.ValidateAsync(model);

                    if (!validationResult.IsValid)
                    {
                        var message = string.Join(" ", validationResult.Errors.Select(e => e.ErrorMessage));
                        throw new ValidationException(message);
                    }
                }
            }

            await next();
        }

        private static T? FindModel(IEnumerable<object?> arguments)
        {
            foreach (var argument in arguments)
            {
                if (argument is T direct) return direct;
            }

            foreach (var argument in arguments)
            {
                if (argument is null) continue;

                foreach (var property in argument.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    if (property.GetIndexParameters().Length > 0) continue;
                    if (property.GetValue(argument) is T nested) return nested;
                }
            }

            return null;
        }
    }
}
