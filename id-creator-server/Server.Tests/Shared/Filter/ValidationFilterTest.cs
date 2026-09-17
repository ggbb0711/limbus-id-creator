using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Server.Shared.Filter;
using ValidationException = Server.Shared.Exception.ValidationException;

namespace Server.Tests.Shared.Filter
{
    public class ValidationFilterTest
    {
        public class SampleModel
        {
            public string Name { get; set; } = "";
        }

        private static (ActionExecutingContext Context, Func<bool> WasNextCalled) BuildContext(
            IServiceProvider serviceProvider, object model)
        {
            var httpContext = new DefaultHttpContext { RequestServices = serviceProvider };
            var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
                httpContext, new RouteData(), new ActionDescriptor());

            var controller = new object();
            var context = new ActionExecutingContext(
                actionContext,
                [],
                new Dictionary<string, object?> { ["model"] = model },
                controller);

            return (context, () => false);
        }

        private static (ActionExecutionDelegate Next, Func<bool> WasCalled) BuildNext(ActionExecutingContext context)
        {
            var called = false;
            ActionExecutionDelegate next = () =>
            {
                called = true;
                return Task.FromResult(new ActionExecutedContext(
                    context, [], new object()));
            };
            return (next, () => called);
        }

        [Fact]
        public async Task OnActionExecutionAsync_CallsNext_WhenValidatorIsNull()
        {
            var services = new ServiceCollection().BuildServiceProvider();
            var (context, _) = BuildContext(services, new SampleModel());
            var (next, wasCalled) = BuildNext(context);
            var filter = new ValidationFilterAttribute<SampleModel>();

            await filter.OnActionExecutionAsync(context, next);

            Assert.True(wasCalled());
        }

        [Fact]
        public async Task OnActionExecutionAsync_CallsNext_WhenValidatorIsNotNullAndModelIsValid()
        {
            var validator = new Mock<IValidator<SampleModel>>();
            validator
                .Setup(v => v.ValidateAsync(It.IsAny<SampleModel>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            var services = new ServiceCollection()
                .AddSingleton(validator.Object)
                .BuildServiceProvider();
            var (context, _) = BuildContext(services, new SampleModel());
            var (next, wasCalled) = BuildNext(context);
            var filter = new ValidationFilterAttribute<SampleModel>();

            await filter.OnActionExecutionAsync(context, next);

            Assert.True(wasCalled());
        }

        [Fact]
        public async Task OnActionExecutionAsync_ThrowsValidationExceptionWithJoinedMessage_WhenModelIsInvalid()
        {
            var failures = new List<ValidationFailure>
            {
                new("Name", "Name is required"),
                new("Name", "Name must be at least 3 characters"),
            };
            var validator = new Mock<IValidator<SampleModel>>();
            validator
                .Setup(v => v.ValidateAsync(It.IsAny<SampleModel>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult(failures));

            var services = new ServiceCollection()
                .AddSingleton(validator.Object)
                .BuildServiceProvider();
            var (context, _) = BuildContext(services, new SampleModel());
            var (next, wasCalled) = BuildNext(context);
            var filter = new ValidationFilterAttribute<SampleModel>();

            var exception = await Assert.ThrowsAsync<ValidationException>(
                () => filter.OnActionExecutionAsync(context, next));

            Assert.Equal("Name is required Name must be at least 3 characters", exception.Message);
            Assert.False(wasCalled());
        }
    }
}
