using System.Reflection;
using System.Text.RegularExpressions;
using Server.Shared.Exception;

namespace Server.Tests.Shared.Exception
{
    public class ApiErrorsTest
    {
        private static List<ErrorInfo> AllErrors() =>
            [.. typeof(ApiErrors)
                .GetFields(BindingFlags.Public | BindingFlags.Static)
                .Where(f => f.FieldType == typeof(ErrorInfo))
                .Select(f => (ErrorInfo)f.GetValue(null)!)];

        [Fact]
        public void Codes_AreUnique()
        {
            var codes = AllErrors().Select(e => e.Code).ToList();
            Assert.Equal(codes.Count, codes.Distinct().Count());
        }

        [Fact]
        public void Codes_AreUpperSnakeCase_AndMessagesAreNotEmpty()
        {
            Assert.All(AllErrors(), e =>
            {
                Assert.Matches(new Regex("^[A-Z]+(_[A-Z]+)*$"), e.Code);
                Assert.False(string.IsNullOrWhiteSpace(e.Message));
            });
        }
    }
}
