using Microsoft.AspNetCore.Mvc.ModelBinding;
using Server.Features.SaveInfo.DTO;

namespace Server.Shared.ModelBinding
{
    public class JsonFormFieldModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder? GetBinder(ModelBinderProviderContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            var modelType = context.Metadata.ModelType;
            if (modelType.IsGenericType && modelType.GetGenericTypeDefinition() == typeof(SavedInfoRequestDTO<>))
            {
                return new JsonFormFieldModelBinder();
            }

            return null;
        }
    }
}
