using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Options;

namespace Server.Shared.ModelBinding
{
    public class JsonFormFieldModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            ArgumentNullException.ThrowIfNull(bindingContext);

            var fieldName = bindingContext.FieldName;
            var valueProviderResult = bindingContext.ValueProvider.GetValue(fieldName);

            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            bindingContext.ModelState.SetModelValue(fieldName, valueProviderResult);

            var rawJson = valueProviderResult.FirstValue;
            if (string.IsNullOrWhiteSpace(rawJson))
            {
                return Task.CompletedTask;
            }

            var jsonOptions = bindingContext.HttpContext.RequestServices
                .GetRequiredService<IOptions<JsonOptions>>().Value.JsonSerializerOptions;

            try
            {
                var model = JsonSerializer.Deserialize(rawJson, bindingContext.ModelType, jsonOptions);
                bindingContext.Result = ModelBindingResult.Success(model);
            }
            catch (JsonException ex)
            {
                bindingContext.ModelState.TryAddModelError(fieldName, $"'{fieldName}' is not valid JSON: {ex.Message}");
                bindingContext.Result = ModelBindingResult.Failed();
            }

            return Task.CompletedTask;
        }
    }
}
