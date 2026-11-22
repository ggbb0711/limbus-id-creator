using System.Globalization;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.Enum;
using Server.Features.SaveInfo.JsonConverter;
using Server.Shared.ModelBinding;

namespace Server.Tests.Shared.ModelBinding
{
    public class JsonFormFieldModelBinderTest
    {
        private const string FieldName = "SaveData";

        private static DefaultModelBindingContext CreateContext(string json)
        {
            var services = new ServiceCollection();
            services.Configure<JsonOptions>(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.Converters.Add(new SkillRequestBaseSystemTextJsonConverter());
                options.JsonSerializerOptions.Converters.Add(new TraitTagSystemTextJsonConverter());
            });
            var httpContext = new DefaultHttpContext { RequestServices = services.BuildServiceProvider() };
            var form = new FormCollection(new Dictionary<string, StringValues> { [FieldName] = json });

            return new DefaultModelBindingContext
            {
                ActionContext = new ActionContext { HttpContext = httpContext },
                FieldName = FieldName,
                ModelMetadata = new EmptyModelMetadataProvider().GetMetadataForType(typeof(SavedInfoRequestDTO<SavedIDRequestDTO>)),
                ModelState = new ModelStateDictionary(),
                ValueProvider = new FormValueProvider(BindingSource.Form, form, CultureInfo.InvariantCulture),
            };
        }

        private static async Task<SavedIDRequestDTO> Bind(string saveInfo)
        {
            var context = CreateContext($$$"""{"saveInfo":{"splashArtTranslation":{"x":0,"y":0},"skillDetails":[]{{{saveInfo}}}}}""");

            await new JsonFormFieldModelBinder().BindModelAsync(context);

            Assert.True(context.Result.IsModelSet);
            return Assert.IsType<SavedInfoRequestDTO<SavedIDRequestDTO>>(context.Result.Model).SaveInfo;
        }

        [Fact]
        public async Task BindModelAsync_ReadsCardStyle_WithLayoutAsText()
        {
            var save = await Bind(""","cardLayout":"Vertical","cardWidth":1800,"cardHeight":1200""");

            Assert.Equal(CardLayout.Vertical, save.CardLayout);
            Assert.Equal(1800, save.CardWidth);
            Assert.Equal(1200, save.CardHeight);
        }

        [Fact]
        public async Task BindModelAsync_UsesDefaultCardStyle_WhenMissing()
        {
            var save = await Bind("");

            Assert.Equal(CardLayout.Horizontal, save.CardLayout);
            Assert.Equal(1440, save.CardWidth);
            Assert.Equal(1000, save.CardHeight);
        }

        [Fact]
        public async Task BindModelAsync_Fails_WhenLayoutIsUnknown()
        {
            var context = CreateContext("""{"saveInfo":{"splashArtTranslation":{"x":0,"y":0},"skillDetails":[],"cardLayout":"Diagonal"}}""");

            await new JsonFormFieldModelBinder().BindModelAsync(context);

            Assert.False(context.Result.IsModelSet);
            Assert.False(context.ModelState.IsValid);
        }
    }
}
