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

        private static void SyncGeneratedImageFields(ImageObj expected, ImageObj actual)
        {
            expected.Id = actual.Id;
            expected.LastUpdated = actual.LastUpdated;
            expected.Status = actual.Status;
        }

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
        public void ForwardMap_GeneratesFreshGuid_ForSinnerIconId()
        {
            Assert.NotEqual(Guid.Empty, _entity.Saved.SinnerIcon.Id);
            Assert.NotEqual(_request.Id, _entity.Saved.SinnerIcon.Id);
        }

        [Fact]
        public void ForwardMap_SyncsSinnerIconId_WithSinnerIconObjectId() =>
            Assert.Equal(_entity.Saved.SinnerIcon.Id, _entity.Saved.SinnerIconId);

        [Fact]
        public void ForwardMap_ProducesExpectedEntity()
        {
            var expected = new SavedEGOInfo
            {
                Id = _request.Id,
                SaveTime = _request.SaveTime,
                ImageAttachId = _request.Id,
                ImageAttach = new ImageObj { Id = _request.Id, Url = PreviewImgUrl },
                SavedEgoKey = _request.Id,
                Saved = new SavedEgo
                {
                    Id = _request.Id,
                    SanityCost = SanityCostValue,
                    SplashArt = new ImageObj { Url = SplashArtUrl },
                    SinResistantWrath = SinResistantWrathValue,
                    SinCostWrath = SinCostWrathValue,
                    SinnerIcon = new ImageObj { Url = SinnerIconUrl },
                    EgoLevel = EgoLevelValue,
                    SavedSkillId = _request.Id,
                    Skill = new SavedSkill
                    {
                        Id = _request.Id,
                        OffenseSkills =
                        [
                            new OffenseSkill
                            {
                                Id = _offenseInputId,
                                Index = 0,
                                SavedSkillId = _request.Id,
                                ImageAttach = new ImageObj { Url = OffenseSkillImageUrl },
                            },
                        ],
                    },
                },
            };

            SyncGeneratedImageFields(expected.ImageAttach, _entity.ImageAttach);
            SyncGeneratedImageFields(expected.Saved.SplashArt, _entity.Saved.SplashArt);
            expected.Saved.SplashArtId = expected.Saved.SplashArt.Id;
            SyncGeneratedImageFields(expected.Saved.SinnerIcon, _entity.Saved.SinnerIcon);
            expected.Saved.SinnerIconId = expected.Saved.SinnerIcon.Id;

            var expectedOffense = expected.Saved.Skill.OffenseSkills.Single();
            SyncGeneratedImageFields(expectedOffense.ImageAttach, _entity.Saved.Skill.OffenseSkills.Single().ImageAttach);
            expectedOffense.ImageAttachId = expectedOffense.ImageAttach.Id;

            Assert.Equivalent(expected, _entity);
        }

        [Fact]
        public void ReverseMap_ProducesExpectedResponse()
        {
            var expected = new SaveInfoResponseDTO<SavedEgoRequestDTO>
            {
                Id = _request.Id,
                PreviewImg = _entity.ImageAttach.Url,
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

            ((RequestOffenseSkill)expected.SaveInfo.SkillDetails[0]).SkillImageId =
                ((RequestOffenseSkill)_response.SaveInfo.SkillDetails[0]).SkillImageId;

            Assert.Equivalent(expected, _response);
        }
    }
}
