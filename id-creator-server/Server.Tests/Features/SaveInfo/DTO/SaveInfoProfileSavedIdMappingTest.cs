using AutoMapper;
using Server.Features.SaveInfo.DTO;
using Server.Features.SaveInfo.DTO.Skills;
using Server.Features.SaveInfo.Enum;
using Server.Shared.Model;

namespace Server.Tests.Features.SaveInfo.DTO
{
    public class SaveInfoProfileSavedIdMappingTest
    {
        private const string PreviewImgUrl = "preview.png";
        private const string SplashArtUrl = "splash.png";
        private const string SinnerIconUrl = "sinner.png";
        private const string OffenseSkillImageUrl = "offense.png";
        private const string DefenseSkillImageUrl = "defense.png";
        private const string CustomEffectImageUrl = "custom.png";
        private const string MentalEffectText = "Mental Effect Text";
        private const string TitleValue = "My Build";
        private const double HPValue = 123.5;

        private readonly IMapper _mapper;
        private readonly SavedInfoRequestDTO<SavedIDRequestDTO> _request;
        private readonly SavedIDInfo _entity;
        private readonly SaveInfoResponseDTO<SavedIDRequestDTO> _response;

        private readonly Guid _offenseInputId = Guid.NewGuid();
        private readonly Guid _defenseInputId = Guid.NewGuid();
        private readonly Guid _passiveInputId = Guid.NewGuid();
        private readonly Guid _customInputId = Guid.NewGuid();
        private readonly Guid _mentalInputId = Guid.NewGuid();

        public SaveInfoProfileSavedIdMappingTest()
        {
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile<SaveInfoProfile>()).CreateMapper();

            _request = new SavedInfoRequestDTO<SavedIDRequestDTO>
            {
                Id = Guid.NewGuid(),
                PreviewImg = PreviewImgUrl,
                SaveInfo = new SavedIDRequestDTO
                {
                    Title = TitleValue,
                    HP = HPValue,
                    SplashArt = SplashArtUrl,
                    SplashArtTranslation = new SplashArtTranslationObj(),
                    SinnerIcon = SinnerIconUrl,
                    SkillDetails =
                    [
                        new RequestPassiveSkill { InputId = _passiveInputId, Index = 0, Type = SkillType.PassiveSkill },
                        new RequestOffenseSkill { InputId = _offenseInputId, Index = 1, Type = SkillType.OffenseSkill, SkillImage = OffenseSkillImageUrl },
                        new RequestMentalEffect { InputId = _mentalInputId, Index = 2, Type = SkillType.MentalEffect, Effect = MentalEffectText },
                        new RequestDefenseSkill { InputId = _defenseInputId, Index = 3, Type = SkillType.DefenseSkill, SkillImage = DefenseSkillImageUrl },
                        new RequestCustomEffect { InputId = _customInputId, Index = 4, Type = SkillType.CustomEffect, CustomImg = CustomEffectImageUrl },
                    ],
                },
            };

            _entity = _mapper.Map<SavedIDInfo>(_request);
            _response = _mapper.Map<SaveInfoResponseDTO<SavedIDRequestDTO>>(_entity);
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
        public void ForwardMap_OffenseSkill_GeneratesFreshImageAttachId()
        {
            var offenseSkill = _entity.Saved.Skill.OffenseSkills.Single();
            Assert.NotEqual(Guid.Empty, offenseSkill.ImageAttachId);
            Assert.Equal(offenseSkill.ImageAttach.Id, offenseSkill.ImageAttachId);
        }

        [Fact]
        public void ReverseMap_SkillDetails_OrderedByIndex() =>
            Assert.Equal([0, 1, 2, 3, 4], _response.SaveInfo.SkillDetails.Select(s => s.Index).ToList());

        [Fact]
        public void ForwardMap_ProducesExpectedEntity()
        {
            var expected = new SavedIDInfo
            {
                Id = _request.Id,
                SaveTime = _request.SaveTime,
                ImageAttachId = _request.Id,
                ImageAttach = new ImageObj { Id = _request.Id, Url = PreviewImgUrl },
                SavedIdKey = _request.Id,
                Saved = new SavedId
                {
                    Id = _request.Id,
                    Title = TitleValue,
                    HP = HPValue,
                    SplashArt = new ImageObj { Url = SplashArtUrl },
                    SinnerIcon = new ImageObj { Url = SinnerIconUrl },
                    SavedSkillId = _request.Id,
                    Skill = new SavedSkill
                    {
                        Id = _request.Id,
                        OffenseSkills =
                        [
                            new OffenseSkill
                            {
                                Id = _offenseInputId,
                                Index = 1,
                                SavedSkillId = _request.Id,
                                ImageAttach = new ImageObj { Url = OffenseSkillImageUrl },
                            },
                        ],
                        DefenseSkills =
                        [
                            new DefenseSkill
                            {
                                Id = _defenseInputId,
                                Index = 3,
                                SavedSkillId = _request.Id,
                                SkillLabel = "SKILL",
                                ImageAttach = new ImageObj { Url = DefenseSkillImageUrl },
                            },
                        ],
                        PassiveSkills =
                        [
                            new PassiveSkill { Id = _passiveInputId, Index = 0, SavedSkillId = _request.Id },
                        ],
                        CustomEffects =
                        [
                            new CustomEffect
                            {
                                Id = _customInputId,
                                Index = 4,
                                SavedSkillId = _request.Id,
                                ImageAttach = new ImageObj { Url = CustomEffectImageUrl },
                            },
                        ],
                        MentalEffects =
                        [
                            new MentalEffect { Id = _mentalInputId, Index = 2, SavedSkillId = _request.Id, Effect = MentalEffectText },
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

            var expectedDefense = expected.Saved.Skill.DefenseSkills.Single();
            SyncGeneratedImageFields(expectedDefense.ImageAttach, _entity.Saved.Skill.DefenseSkills.Single().ImageAttach);
            expectedDefense.ImageAttachId = expectedDefense.ImageAttach.Id;

            var expectedCustom = expected.Saved.Skill.CustomEffects.Single();
            SyncGeneratedImageFields(expectedCustom.ImageAttach, _entity.Saved.Skill.CustomEffects.Single().ImageAttach);
            expectedCustom.ImageAttachId = expectedCustom.ImageAttach.Id;

            Assert.Equivalent(expected, _entity);
        }

        [Fact]
        public void ReverseMap_ProducesExpectedResponse()
        {
            var expected = new SaveInfoResponseDTO<SavedIDRequestDTO>
            {
                Id = _request.Id,
                PreviewImg = _entity.ImageAttach.Url,
                SaveInfo = new SavedIDRequestDTO
                {
                    Title = TitleValue,
                    HP = HPValue,
                    SplashArt = SplashArtUrl,
                    SplashArtTranslation = new SplashArtTranslationObj(),
                    SinnerIcon = SinnerIconUrl,
                    SkillDetails =
                    [
                        new RequestPassiveSkill { InputId = _passiveInputId, Index = 0, Type = SkillType.PassiveSkill },
                        new RequestOffenseSkill { InputId = _offenseInputId, Index = 1, Type = SkillType.OffenseSkill, SkillImage = OffenseSkillImageUrl },
                        new RequestMentalEffect { InputId = _mentalInputId, Index = 2, Type = SkillType.MentalEffect, Effect = MentalEffectText },
                        new RequestDefenseSkill { InputId = _defenseInputId, Index = 3, Type = SkillType.DefenseSkill, SkillImage = DefenseSkillImageUrl },
                        new RequestCustomEffect { InputId = _customInputId, Index = 4, Type = SkillType.CustomEffect, CustomImg = CustomEffectImageUrl },
                    ],
                },
            };

            ((RequestOffenseSkill)expected.SaveInfo.SkillDetails[1]).SkillImageId =
                ((RequestOffenseSkill)_response.SaveInfo.SkillDetails[1]).SkillImageId;
            ((RequestDefenseSkill)expected.SaveInfo.SkillDetails[3]).SkillImageId =
                ((RequestDefenseSkill)_response.SaveInfo.SkillDetails[3]).SkillImageId;
            ((RequestCustomEffect)expected.SaveInfo.SkillDetails[4]).CustomImgId =
                ((RequestCustomEffect)_response.SaveInfo.SkillDetails[4]).CustomImgId;

            Assert.Equivalent(expected, _response);
        }
    }
}
