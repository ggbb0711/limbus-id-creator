using AutoMapper;
using Server.Features.SaveInfo.DTO;

namespace Server.Tests.Features.SaveInfo.DTO
{
    public class SaveInfoProfileConfigurationTest
    {
        [Fact]
        public void ShouldHaveValidConfiguration()
        {
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile<SaveInfoProfile>());

            configuration.AssertConfigurationIsValid();
        }
    }
}
