using AutoMapper;
using Server.Features.SaveInfo.DTO.Skills;
using Server.Features.SaveInfo.Enum;
using Server.Shared.Model;

namespace Server.Features.SaveInfo.DTO
{
    public class SaveInfoProfile: Profile
    {
        public SaveInfoProfile()
        {
            CreateMap<SavedInfoRequestDTO<SavedEgoRequestDTO>, SavedEGOInfo>()
                .ForMember(dest => dest.ImageAttachId, opt => opt.MapFrom(src=>src.Id))
                .ForMember(dest => dest.ImageAttach, opt => opt.MapFrom(src => new ImageObj(){
                    Id = src.Id,
                    Url=src.PreviewImg,
                }))
                .ForMember(dest => dest.Saved, opt => opt.MapFrom(src => src.SaveInfo))
                .ForMember(dest => dest.SavedEgoKey, opt => opt.MapFrom(src=>src.Id))
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .AfterMap((s,d,ctx)=>
                {
                    d.Saved.Id = s.Id;
                    d.Saved.SavedSkillId = s.Id;
                    d.Saved.Skill = MapNewSkill(s.Id, s.SaveInfo.SkillDetails, ctx.Mapper);
                });

            CreateMap<SavedInfoRequestDTO<SavedIDRequestDTO>, SavedIDInfo>()
                .ForMember(dest => dest.ImageAttachId, opt => opt.MapFrom(src=>src.Id))
                .ForMember(dest => dest.ImageAttach, opt => opt.MapFrom(src => new ImageObj(){
                    Id = src.Id,
                    Url=src.PreviewImg,
                }))
                .ForMember(dest => dest.Saved, opt => opt.MapFrom(src => src.SaveInfo))
                .ForMember(dest => dest.SavedIdKey, opt => opt.MapFrom(src=>src.Id))
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .AfterMap((s,d,ctx)=>
                {
                    d.Saved.Id = s.Id;
                    d.Saved.SavedSkillId = s.Id;
                    d.Saved.Skill = MapNewSkill(s.Id, s.SaveInfo.SkillDetails,ctx.Mapper);
                });

            CreateMap<SavedEgoRequestDTO, SavedEgo>()
                .ForMember(d => d.SplashArt, opt => opt.MapFrom(s => new ImageObj { Id = Guid.NewGuid(), Url = s.SplashArt }))
                .ForMember(d => d.SinnerIcon, opt => opt.MapFrom(s => new ImageObj { Id = Guid.NewGuid(), Url = s.SinnerIcon }))
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.SavedSkillId, opt => opt.Ignore())
                .ForMember(d => d.Skill, opt => opt.Ignore())
                .ForMember(d => d.SplashArtId, opt => opt.Ignore())
                .ForMember(d => d.SinnerIconId, opt => opt.Ignore())
                .AfterMap((s, d) =>
                {
                    d.SplashArtId = d.SplashArt.Id;
                    d.SinnerIconId = d.SinnerIcon.Id;
                })
                .ReverseMap()
                    .ForMember(d => d.SplashArt, opt => opt.MapFrom(s => s.SplashArt.Url))
                    .ForMember(d => d.SinnerIcon, opt => opt.MapFrom(s => s.SinnerIcon.Url))
                    .ForMember(d => d.SkillDetails, opt => opt.MapFrom((s,_,_,ctx) => MapSkillRequest(s.Skill, ctx.Mapper)));

            CreateMap<SavedIDRequestDTO, SavedId>()
                .ForMember(d => d.SplashArt, opt => opt.MapFrom(s => new ImageObj { Id = Guid.NewGuid(), Url = s.SplashArt }))
                .ForMember(d => d.SinnerIcon, opt => opt.MapFrom(s => new ImageObj { Id = Guid.NewGuid(), Url = s.SinnerIcon }))
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.SavedSkillId, opt => opt.Ignore())
                .ForMember(d => d.Skill, opt => opt.Ignore())
                .ForMember(d => d.SplashArtId, opt => opt.Ignore())
                .ForMember(d => d.SinnerIconId, opt => opt.Ignore())
                .AfterMap((s, d) =>
                {
                    d.SplashArtId = d.SplashArt.Id;
                    d.SinnerIconId = d.SinnerIcon.Id;
                })
                .ReverseMap()
                    .ForMember(d => d.SplashArt, opt => opt.MapFrom(s => s.SplashArt.Url))
                    .ForMember(d => d.SinnerIcon, opt => opt.MapFrom(s => s.SinnerIcon.Url))
                    .ForMember(d => d.SkillDetails, opt => opt.MapFrom((s,_,_,ctx) => MapSkillRequest(s.Skill, ctx.Mapper)));

            CreateMap<SavedEGOInfo,SaveInfoResponseDTO<SavedEgoRequestDTO>>()
                .ForMember(dest=>dest.PreviewImg,opt=>opt.MapFrom(src=>src.ImageAttach.Url))
                .ForMember(dest=>dest.SaveInfo,opt=>opt.MapFrom(src=>src.Saved));

            CreateMap<SavedIDInfo,SaveInfoResponseDTO<SavedIDRequestDTO>>()
                .ForMember(dest=>dest.PreviewImg,opt=>opt.MapFrom(src=>src.ImageAttach.Url))
                .ForMember(dest=>dest.SaveInfo,opt=>opt.MapFrom(src=>src.Saved));

            CreateMap<RequestOffenseSkill,OffenseSkill>()
                .ForMember(dest=>dest.Id, opt=>opt.MapFrom(src=>src.InputId))
                .ForMember(dest=>dest.SavedSkillId, opt=>opt.Ignore())
                .ForMember(dest=>dest.ImageAttachId, opt=>opt.Ignore())
                .ForMember(dest=>dest.ImageAttach, opt=>opt.Ignore())
                .ReverseMap()
                    .ForMember(dest=>dest.SkillImage, opt=>opt.MapFrom(src=>src.ImageAttach.Url));

            CreateMap<RequestDefenseSkill,DefenseSkill>()
                .ForMember(dest=>dest.Id, opt=>opt.MapFrom(src=>src.InputId))
                .ForMember(dest=>dest.SavedSkillId, opt=>opt.Ignore())
                .ForMember(dest=>dest.ImageAttachId, opt=>opt.Ignore())
                .ForMember(dest=>dest.ImageAttach, opt=>opt.Ignore())
                .ReverseMap()
                    .ForMember(dest=>dest.SkillImage, opt=>opt.MapFrom(src=>src.ImageAttach.Url));

            CreateMap<RequestPassiveSkill,PassiveSkill>()
                .ForMember(dest=>dest.Id, opt=>opt.MapFrom(src=>src.InputId))
                .ForMember(dest=>dest.SavedSkillId, opt=>opt.Ignore())
                .ReverseMap();

            CreateMap<RequestCustomEffect,CustomEffect>()
                .ForMember(dest=>dest.Id, opt=>opt.MapFrom(src=>src.InputId))
                .ForMember(dest=>dest.SavedSkillId, opt=>opt.Ignore())
                .ForMember(dest=>dest.ImageAttachId, opt=>opt.Ignore())
                .ForMember(dest=>dest.ImageAttach, opt=>opt.Ignore())
                .ReverseMap()
                    .ForMember(dest=>dest.CustomImg, opt=>opt.MapFrom(src=>src.ImageAttach.Url));

            CreateMap<RequestMentalEffect,MentalEffect>()
                .ForMember(dest=>dest.Id, opt=>opt.MapFrom(src=>src.InputId))
                .ForMember(dest=>dest.SavedSkillId, opt=>opt.Ignore())
                .ReverseMap();
        }

        private static SavedSkill MapNewSkill(Guid SaveSkillId, List<SkillRequestBase> skills, IRuntimeMapper mapper)
        {
            var newSkills = new SavedSkill(){Id=SaveSkillId};
            ICollection<OffenseSkill> offenseSkills = [];
            ICollection<DefenseSkill> defenseSkills = [];
            ICollection<PassiveSkill> passiveSkills = [];
            ICollection<CustomEffect> customEffects = [];
            ICollection<MentalEffect> mentalEffects = [];
            for (int i = 0; i < skills.Count; i++)
            {
                var skill = skills[i];
                switch (skill.Type)
                {
                    case SkillType.OffenseSkill:
                    {
                        var offenseSkill = (RequestOffenseSkill) skill;
                        var imageId = Guid.NewGuid();
                        var newOffenseSkill = mapper.Map<OffenseSkill>(offenseSkill);
                        newOffenseSkill.ImageAttachId = imageId;
                        newOffenseSkill.ImageAttach = new ImageObj()
                        {
                            Id = imageId,
                            Url = offenseSkill.SkillImage,
                        };
                        newOffenseSkill.SavedSkillId = SaveSkillId;
                        offenseSkills.Add(newOffenseSkill);
                        break;
                    }
                    case SkillType.DefenseSkill:
                    {
                        var defenseSkill = (RequestDefenseSkill) skill;
                        var imageId = Guid.NewGuid();
                        var newDefenseSkill = mapper.Map<DefenseSkill>(defenseSkill);
                        newDefenseSkill.ImageAttachId = imageId;
                        newDefenseSkill.ImageAttach = new ImageObj()
                        {
                            Id = imageId,
                            Url = defenseSkill.SkillImage,
                        };
                        newDefenseSkill.SavedSkillId = SaveSkillId;
                        defenseSkills.Add(newDefenseSkill);
                        break;
                    }
                    case SkillType.PassiveSkill:
                    {
                        var passiveSkill = (RequestPassiveSkill) skill;
                        var newPassiveSkill = mapper.Map<PassiveSkill>(passiveSkill);
                        newPassiveSkill.SavedSkillId = SaveSkillId;
                        passiveSkills.Add(newPassiveSkill);
                        break;
                    }
                    case SkillType.CustomEffect:
                    {
                        var customEffect = (RequestCustomEffect) skill;
                        var imageId = Guid.NewGuid();
                        var newCustomEffect = mapper.Map<CustomEffect>(customEffect);
                        newCustomEffect.ImageAttachId = imageId;
                        newCustomEffect.ImageAttach = new ImageObj()
                        {
                            Id = imageId,
                            Url = customEffect.CustomImg,
                        };
                        newCustomEffect.SavedSkillId = SaveSkillId;
                        customEffects.Add(newCustomEffect);
                        break;
                    }
                    case SkillType.MentalEffect:
                    {
                        var mentalEffect = (RequestMentalEffect) skill;
                        var newMentalEffect = mapper.Map<MentalEffect>(mentalEffect);
                        newMentalEffect.SavedSkillId = SaveSkillId;
                        mentalEffects.Add(newMentalEffect);
                        break;
                    }
                }
            }
            newSkills.OffenseSkills = offenseSkills;
            newSkills.DefenseSkills = defenseSkills;
            newSkills.PassiveSkills = passiveSkills;
            newSkills.CustomEffects = customEffects;
            newSkills.MentalEffects = mentalEffects;
            return newSkills;
        }
        
        private static List<SkillRequestBase> MapSkillRequest(SavedSkill src, IRuntimeMapper mapper)
        {
            var list = SavedSkill.CompileSkill(src);
            var newSkillList = new List<SkillRequestBase>();
            for(int i = 0; i < list.Count; i++)
            {
                var skill = list[i];
                switch(skill.Type)
                {
                    case SkillType.OffenseSkill:
                    {
                        var offenseSkill = (OffenseSkill) skill;
                        newSkillList.Add(mapper.Map<RequestOffenseSkill>(offenseSkill));
                        break;
                    }
                    case SkillType.DefenseSkill:
                    {
                        var defenseSkill = (DefenseSkill) skill;
                        newSkillList.Add(mapper.Map<RequestDefenseSkill>(defenseSkill));
                        break;
                    }
                    case SkillType.PassiveSkill:
                    {
                        var PassiveSkill = (PassiveSkill) skill;
                        newSkillList.Add(mapper.Map<RequestPassiveSkill>(PassiveSkill));
                        break;
                    }
                    case SkillType.CustomEffect:
                    {
                        var customEffect = (CustomEffect) skill;
                        newSkillList.Add(mapper.Map<RequestCustomEffect>(customEffect));
                        break;
                    }
                    case SkillType.MentalEffect:
                    {
                        var mentalEffect = (MentalEffect) skill;
                        newSkillList.Add(mapper.Map<RequestMentalEffect>(mentalEffect));
                        break;
                    }
                };
            }

            return newSkillList;
        }
    }
}
