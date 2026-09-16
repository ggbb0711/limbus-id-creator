using AutoMapper;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.DTO.Skills;
using Server.Features.SaveInfo.Enum;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo.DTO
{
    public class SaveInfoProfileSavedEgoMappingTest
    {
        private const string PreviewImgUrl = "preview.png";
        private const string SplashArtUrl = "splash.png";
        private const string SinnerIconUrl = "sinner.png";
        private const string OffenseSkillImageUrl = "offense.png";
        private const string EgoLevelValue = "ZAYIN";
        private const double SanityCostValue = 45;
        private const double SinResistantWrathValue = 12.5;
        private const double SinCostWrathValue = 3;

        private readonly IMapper _mapper;
        private readonly SavedInfoRequestDTO<SavedEgoRequestDTO> _request;
        private readonly SavedEGOInfo _entity;
        private readonly SaveInfoResponseDTO<SavedEgoRequestDTO> _response;

        private readonly Guid _offenseInputId = Guid.NewGuid();

        public SaveInfoProfileSavedEgoMappingTest()
        {
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile<SaveInfoProfile>()).CreateMapper();

            _request = new SavedInfoRequestDTO<SavedEgoRequestDTO>
            {
                Id = Guid.NewGuid(),
                PreviewImg = PreviewImgUrl,
                SaveInfo = new SavedEgoRequestDTO
                {
                    SanityCost = SanityCostValue,
                    SplashArt = SplashArtUrl,
                    SplashArtTranslation = new SplashArtTranslationObj(),
                    SinResistant = new SavedEgoRequestDTO.SinResistantObj { Wrath = SinResistantWrathValue },
                    SinCost = new SavedEgoRequestDTO.SinCostObj { Wrath = SinCostWrathValue },
                    SinnerIcon = SinnerIconUrl,
                    EgoLevel = EgoLevelValue,
                    SkillDetails =
                    [
                        new RequestOffenseSkill { InputId = _offenseInputId, Index = 0, Type = SkillType.OffenseSkill, SkillImage = OffenseSkillImageUrl },
                    ],
                },
            };

            _entity = _mapper.Map<SavedEGOInfo>(_request);
            _response = _mapper.Map<SaveInfoResponseDTO<SavedEgoRequestDTO>>(_entity);
        }

        [Fact]
        public void ForwardMap_SetsImageAttachId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.ImageAttachId);

        [Fact]
        public void ForwardMap_SetsImageAttachUrl_FromPreviewImg() =>
            Assert.Equal(_request.PreviewImg, _entity.ImageAttach.Url);

        [Fact]
        public void ForwardMap_SetsSavedEgoKey_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.SavedEgoKey);

        [Fact]
        public void ForwardMap_SetsSavedId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.Saved.Id);

        [Fact]
        public void ForwardMap_SetsSavedSkillId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.Saved.SavedSkillId);

        [Fact]
        public void ForwardMap_SetsSplashArtUrl() =>
            Assert.Equal(SplashArtUrl, _entity.Saved.SplashArt.Url);

        [Fact]
        public void ForwardMap_GeneratesFreshGuid_ForSplashArtId()
        {
            Assert.NotEqual(Guid.Empty, _entity.Saved.SplashArt.Id);
            Assert.NotEqual(_request.Id, _entity.Saved.SplashArt.Id);
        }

        [Fact]
        public void ForwardMap_SyncsSplashArtId_WithSplashArtObjectId() =>
            Assert.Equal(_entity.Saved.SplashArt.Id, _entity.Saved.SplashArtId);

        [Fact]
        public void ForwardMap_SetsSinnerIconUrl() =>
            Assert.Equal(SinnerIconUrl, _entity.Saved.SinnerIcon.Url);

        [Fact]
        public void ForwardMap_GeneratesFreshGuid_ForSinnerIconId()
        {
            Assert.NotEqual(Guid.Empty, _entity.Saved.SinnerIcon.Id);
            Assert.NotEqual(_request.Id, _entity.Saved.SinnerIcon.Id);
        }

        [Fact]
        public void ForwardMap_SyncsSinnerIconId_WithSinnerIconObjectId() =>
            Assert.Equal(_entity.Saved.SinnerIcon.Id, _entity.Saved.SinnerIconId);

        [Fact]
        public void ForwardMap_MapsSanityCost() =>
            Assert.Equal(SanityCostValue, _entity.Saved.SanityCost);

        [Fact]
        public void ForwardMap_MapsEgoLevel() =>
            Assert.Equal(EgoLevelValue, _entity.Saved.EgoLevel);

        [Fact]
        public void ForwardMap_FlattensSinResistantWrath() =>
            Assert.Equal(SinResistantWrathValue, _entity.Saved.SinResistantWrath);

        [Fact]
        public void ForwardMap_FlattensSinCostWrath() =>
            Assert.Equal(SinCostWrathValue, _entity.Saved.SinCostWrath);

        [Fact]
        public void ForwardMap_SetsSkillId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.Id);

        [Fact]
        public void ForwardMap_OffenseSkill_MapsIdFromInputId() =>
            Assert.Equal(_offenseInputId, _entity.Saved.Skill.OffenseSkills.Single().Id);

        [Fact]
        public void ForwardMap_OffenseSkill_MapsImageUrl() =>
            Assert.Equal(OffenseSkillImageUrl, _entity.Saved.Skill.OffenseSkills.Single().ImageAttach.Url);

        [Fact]
        public void ReverseMap_SetsPreviewImg_FromImageAttachUrl() =>
            Assert.Equal(_entity.ImageAttach.Url, _response.PreviewImg);

        [Fact]
        public void ReverseMap_SetsSplashArtUrl() =>
            Assert.Equal(_entity.Saved.SplashArt.Url, _response.SaveInfo.SplashArt);

        [Fact]
        public void ReverseMap_SetsSinnerIconUrl() =>
            Assert.Equal(_entity.Saved.SinnerIcon.Url, _response.SaveInfo.SinnerIcon);

        [Fact]
        public void ReverseMap_OffenseSkill_RoundTripsInputId()
        {
            var offenseSkill = Assert.IsType<RequestOffenseSkill>(_response.SaveInfo.SkillDetails.Single());
            Assert.Equal(_offenseInputId, offenseSkill.InputId);
        }

        [Fact]
        public void ReverseMap_OffenseSkill_RoundTripsSkillImage()
        {
            var offenseSkill = Assert.IsType<RequestOffenseSkill>(_response.SaveInfo.SkillDetails.Single());
            Assert.Equal(OffenseSkillImageUrl, offenseSkill.SkillImage);
        }
    }
}
