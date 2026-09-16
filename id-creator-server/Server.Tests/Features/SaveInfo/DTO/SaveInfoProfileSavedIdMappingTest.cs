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

        [Fact]
        public void ForwardMap_SetsImageAttachId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.ImageAttachId);

        [Fact]
        public void ForwardMap_SetsImageAttachObjectId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.ImageAttach.Id);

        [Fact]
        public void ForwardMap_SetsImageAttachUrl_FromPreviewImg() =>
            Assert.Equal(_request.PreviewImg, _entity.ImageAttach.Url);

        [Fact]
        public void ForwardMap_SetsSavedIdKey_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.SavedIdKey);

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
        public void ForwardMap_MapsTitle() =>
            Assert.Equal(TitleValue, _entity.Saved.Title);

        [Fact]
        public void ForwardMap_MapsHP() =>
            Assert.Equal(HPValue, _entity.Saved.HP);

        [Fact]
        public void ForwardMap_SetsSkillId_ToRequestId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.Id);

        [Fact]
        public void ForwardMap_OffenseSkill_MapsIdFromInputId() =>
            Assert.Equal(_offenseInputId, _entity.Saved.Skill.OffenseSkills.Single().Id);

        [Fact]
        public void ForwardMap_OffenseSkill_MapsSavedSkillId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.OffenseSkills.Single().SavedSkillId);

        [Fact]
        public void ForwardMap_OffenseSkill_MapsImageUrl() =>
            Assert.Equal(OffenseSkillImageUrl, _entity.Saved.Skill.OffenseSkills.Single().ImageAttach.Url);

        [Fact]
        public void ForwardMap_OffenseSkill_GeneratesFreshImageAttachId()
        {
            var offenseSkill = _entity.Saved.Skill.OffenseSkills.Single();
            Assert.NotEqual(Guid.Empty, offenseSkill.ImageAttachId);
            Assert.Equal(offenseSkill.ImageAttach.Id, offenseSkill.ImageAttachId);
        }

        [Fact]
        public void ForwardMap_DefenseSkill_MapsIdFromInputId() =>
            Assert.Equal(_defenseInputId, _entity.Saved.Skill.DefenseSkills.Single().Id);

        [Fact]
        public void ForwardMap_DefenseSkill_MapsSavedSkillId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.DefenseSkills.Single().SavedSkillId);

        [Fact]
        public void ForwardMap_DefenseSkill_MapsImageUrl() =>
            Assert.Equal(DefenseSkillImageUrl, _entity.Saved.Skill.DefenseSkills.Single().ImageAttach.Url);

        [Fact]
        public void ForwardMap_PassiveSkill_MapsIdFromInputId() =>
            Assert.Equal(_passiveInputId, _entity.Saved.Skill.PassiveSkills.Single().Id);

        [Fact]
        public void ForwardMap_PassiveSkill_MapsSavedSkillId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.PassiveSkills.Single().SavedSkillId);

        [Fact]
        public void ForwardMap_CustomEffect_MapsIdFromInputId() =>
            Assert.Equal(_customInputId, _entity.Saved.Skill.CustomEffects.Single().Id);

        [Fact]
        public void ForwardMap_CustomEffect_MapsSavedSkillId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.CustomEffects.Single().SavedSkillId);

        [Fact]
        public void ForwardMap_CustomEffect_MapsImageUrl() =>
            Assert.Equal(CustomEffectImageUrl, _entity.Saved.Skill.CustomEffects.Single().ImageAttach.Url);

        [Fact]
        public void ForwardMap_MentalEffect_MapsIdFromInputId() =>
            Assert.Equal(_mentalInputId, _entity.Saved.Skill.MentalEffects.Single().Id);

        [Fact]
        public void ForwardMap_MentalEffect_MapsSavedSkillId() =>
            Assert.Equal(_request.Id, _entity.Saved.Skill.MentalEffects.Single().SavedSkillId);

        [Fact]
        public void ForwardMap_MentalEffect_MapsEffectText() =>
            Assert.Equal(MentalEffectText, _entity.Saved.Skill.MentalEffects.Single().Effect);

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
        public void ReverseMap_SkillDetails_HasFiveEntries() =>
            Assert.Equal(5, _response.SaveInfo.SkillDetails.Count);

        [Fact]
        public void ReverseMap_SkillDetails_OrderedByIndex() =>
            Assert.Equal([0, 1, 2, 3, 4], _response.SaveInfo.SkillDetails.Select(s => s.Index).ToList());

        [Fact]
        public void ReverseMap_OffenseSkill_RoundTripsInputId()
        {
            var offenseSkill = Assert.IsType<RequestOffenseSkill>(_response.SaveInfo.SkillDetails.Single(s => s.Type == SkillType.OffenseSkill));
            Assert.Equal(_offenseInputId, offenseSkill.InputId);
        }

        [Fact]
        public void ReverseMap_OffenseSkill_RoundTripsSkillImage()
        {
            var offenseSkill = Assert.IsType<RequestOffenseSkill>(_response.SaveInfo.SkillDetails.Single(s => s.Type == SkillType.OffenseSkill));
            Assert.Equal(OffenseSkillImageUrl, offenseSkill.SkillImage);
        }

        [Fact]
        public void ReverseMap_DefenseSkill_RoundTripsInputId()
        {
            var defenseSkill = Assert.IsType<RequestDefenseSkill>(_response.SaveInfo.SkillDetails.Single(s => s.Type == SkillType.DefenseSkill));
            Assert.Equal(_defenseInputId, defenseSkill.InputId);
        }

        [Fact]
        public void ReverseMap_CustomEffect_RoundTripsCustomImg()
        {
            var customEffect = Assert.IsType<RequestCustomEffect>(_response.SaveInfo.SkillDetails.Single(s => s.Type == SkillType.CustomEffect));
            Assert.Equal(CustomEffectImageUrl, customEffect.CustomImg);
        }

        [Fact]
        public void ReverseMap_MentalEffect_RoundTripsEffect()
        {
            var mentalEffect = Assert.IsType<RequestMentalEffect>(_response.SaveInfo.SkillDetails.Single(s => s.Type == SkillType.MentalEffect));
            Assert.Equal(MentalEffectText, mentalEffect.Effect);
        }
    }
}
