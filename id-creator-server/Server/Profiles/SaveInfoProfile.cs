using AutoMapper;
using Microsoft.Extensions.ObjectPool;
using Server.DTOs.Requests.SavedInfo;
using Server.DTOs.Requests.SavedInfo.SavedEgo;
using Server.DTOs.Requests.SavedInfo.SavedID;
using Server.DTOs.Requests.SavedInfo.Skills;
using Server.DTOs.Response.Users;
using Server.Models;

namespace Server.Profiles
{
    public class SaveInfoProfile: Profile
    {
        public SaveInfoProfile()
        {
            CreateMap<SavedInfoRequestDTO<SavedEgoRequestDTO>, SavedInfo>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.saveName))
                .ForMember(dest => dest.SaveTime, opt => opt.MapFrom(src => DateTime.Parse(src.saveTime)))
                .ForMember(dest => dest.ImageAttach, opt => opt.MapFrom(src => src.previewImg))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src=>src.tags.Select(tag=>new Tag(){TagName = tag}))) // Tags need special handling
                .ForMember(dest => dest.SavedEgo, opt => opt.MapFrom(src => new SavedEgo()
                {
                    Title = src.saveInfo.Title,
                    Name = src.saveInfo.Name,
                    SanityCost = src.saveInfo.SanityCost,
                    SplashArt = src.saveInfo.SplashArt,
                    SplashArtScale = (int)src.saveInfo.SplashArtScale,
                    SplashArtTranslationX = (int)src.saveInfo.SplashArtTranslation.X,
                    SplashArtTranslationY = (int)src.saveInfo.SplashArtTranslation.Y,
                    SinResistantWrath = src.saveInfo.SinResistant.WrathResistant,
                    SinResistantLust = src.saveInfo.SinResistant.LustResistant,
                    SinResistantSloth = src.saveInfo.SinResistant.SlothResistant,
                    SinResistantGluttony = src.saveInfo.SinResistant.GluttonyResistant,
                    SinResistantGloom = src.saveInfo.SinResistant.GloomResistant,
                    SinResistantPride = src.saveInfo.SinResistant.PrideResistant,
                    SinResistantEnvy = src.saveInfo.SinResistant.EnvyResistant,
                    SinCostWrath = src.saveInfo.SinCost.WrathCost,
                    SinCostLust = src.saveInfo.SinCost.LustCost,
                    SinCostSloth = src.saveInfo.SinCost.SlothCost,
                    SinCostGluttony = src.saveInfo.SinCost.GluttonyCost,
                    SinCostGloom = src.saveInfo.SinCost.GloomCost,
                    SinCostPride = src.saveInfo.SinCost.PrideCost,
                    SinCostEnvy = src.saveInfo.SinCost.EnvyCost,
                    SinnerColor = src.saveInfo.SinnerColor,
                    SinnerIcon = src.saveInfo.SinnerIcon,
                    EgoLevel = src.saveInfo.EgoLevel,
                    SavedSkillId = src.Id,
                    Skill = MapNewSkill(src.Id,src.saveInfo.SkillDetails)
                }));
                
            CreateMap<SavedInfoRequestDTO<SavedIDRequestDTO>, SavedInfo>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.saveName))
                .ForMember(dest => dest.SaveTime, opt => opt.MapFrom(src => DateTime.Parse(src.saveTime)))
                .ForMember(dest => dest.ImageAttach, opt => opt.MapFrom(src => src.previewImg))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.tags.Select(tag => new Tag() { TagName = tag }))) // Tags need special handling
                .ForMember(dest => dest.SavedId, opt => opt.MapFrom(src => new SavedId()
                {
                    Title = src.saveInfo.Title,
                    Name = src.saveInfo.Name,
                    SplashArt = src.saveInfo.SplashArt,
                    SplashArtScale = (int)src.saveInfo.SplashArtScale,
                    SplashArtTranslationX = (int)src.saveInfo.SplashArtTranslation.X,
                    SplashArtTranslationY = (int)src.saveInfo.SplashArtTranslation.Y,
                    HP = src.saveInfo.HP,
                    MinSpeed = src.saveInfo.MinSpeed,
                    MaxSpeed = src.saveInfo.MaxSpeed,
                    StaggerResist = src.saveInfo.StaggerResist,
                    DefenseLevel = src.saveInfo.DefenseLevel,
                    SinnerColor = src.saveInfo.SinnerColor,
                    SinnerIcon = src.saveInfo.SinnerIcon,
                    SlashResistant = src.saveInfo.SlashResistant,
                    PierceResistant = src.saveInfo.PierceResistant,
                    BluntResistant = src.saveInfo.BluntResistant,
                    Rarity = src.saveInfo.Rarity,
                    SavedSkillId = src.Id,
                    Skill = MapNewSkill(src.Id, src.saveInfo.SkillDetails)
                }));
        }

         private SavedSkill MapNewSkill(Guid SaveSkillId, List<object> skills)
        {
            var newSkills = new SavedSkill(){Id=SaveSkillId};
            var count =0 ;
            newSkills.OffenseSkills =(ICollection<OffenseSkill>) skills
            .Where(skill=>
                {
                    count++;
                    return ((RequestOffenseSkill)skill).Type.Equals("OffenseSkill");
                })
                .Select(skill=>
                {
                    var offenseSkill = (RequestOffenseSkill) skill;
                    var newOffenseSkill = new OffenseSkill()
                    {
                        Id = offenseSkill.InputId,
                        SkillLevel = offenseSkill.SkillLevel,
                        SkillAmt = offenseSkill.SkillAmt,
                        AtkWeight = offenseSkill.AtkWeight,
                        DamageType = offenseSkill.DamageType,
                        Name = offenseSkill.Name,
                        SkillAffinity = offenseSkill.SkillAffinity,
                        BasePower = offenseSkill.BasePower,
                        CoinNo = offenseSkill.CoinNo,
                        CoinPow = offenseSkill.CoinPow,
                        ImageAttach = offenseSkill.SkillImage,
                        SkillEffect = offenseSkill.SkillEffect,
                        SkillLabel = offenseSkill.SkillLabel,
                        Type = offenseSkill.Type,
                        Index = count,
                        SaveSkillId = SaveSkillId
                    };
                    return newOffenseSkill;
                }
            );

            count = 0;
            newSkills.DefenseSkills = (ICollection<DefenseSkill>) skills
            .Where(skill => 
            {
                count++;
                return ((RequestDefenseSkill)skill).Type.Equals("DefenseSkill");
            })
            .Select(skill => 
            {
                var defenseSkill = (RequestDefenseSkill) skill;
                var newDefenseSkill = new DefenseSkill()
                {
                    Id = defenseSkill.InputId,
                    SkillLevel = defenseSkill.SkillLevel,
                    SkillAmt = defenseSkill.SkillAmt,
                    AtkWeight = defenseSkill.AtkWeight,
                    DefenseType = defenseSkill.DefenseType,
                    DamageType = defenseSkill.DamageType,
                    Name = defenseSkill.Name,
                    SkillAffinity = defenseSkill.SkillAffinity,
                    BasePower = defenseSkill.BasePower,
                    CoinNo = defenseSkill.CoinNo,
                    CoinPow = defenseSkill.CoinPow,
                    ImageAttach = defenseSkill.SkillImage,
                    SkillEffect = defenseSkill.SkillEffect,
                    SkillLabel = defenseSkill.SkillLabel,
                    Type = defenseSkill.Type,
                    Index = count,
                    SavedSkillId = SaveSkillId 
                };
                return newDefenseSkill;
            });

            count = 0;
            newSkills.PassiveSkills = (ICollection<PassiveSkill>) skills
            .Where(skill => 
            {
                count++;
                return ((RequestPassiveSkill)skill).Type.Equals("PassiveSkill");
            })
            .Select(skill => 
            {
                var passiveSkill = (RequestPassiveSkill) skill;
                var newPassiveSkill = new PassiveSkill()
                {
                    Id = passiveSkill.InputId,
                    SkillLabel = passiveSkill.SkillLabel,
                    Name = passiveSkill.Name,
                    SkillEffect = passiveSkill.SkillEffect,
                    Type = passiveSkill.Type,
                    Affinity = passiveSkill.Affinity,
                    Req = passiveSkill.Req,
                    ReqNo = passiveSkill.ReqNo,
                    Index = count,
                    SaveSkillId = SaveSkillId
                };
                return newPassiveSkill;
            });

            count = 0;
            newSkills.CustomEffects = (ICollection<CustomEffect>) skills
            .Where(skill => 
            {
                count++;
                return ((RequestCustomEffect)skill).Type.Equals("CustomEffect");
            })
            .Select(skill => 
            {
                var customEffect = (RequestCustomEffect) skill;
                var newCustomEffect = new CustomEffect()
                {
                    Id = Guid.NewGuid(), 
                    Name = customEffect.Name,
                    ImageAttach = customEffect.CustomImg,
                    EffectColor = customEffect.EffectColor,
                    Effect = customEffect.Effect,
                    Type = customEffect.Type,
                    Index = count,
                    SavedSkillId = SaveSkillId 
                };
                return newCustomEffect;
            });

            count = 0;
            newSkills.MentalEffects = (ICollection<MentalEffect>) skills
            .Where(skill => 
            {
                count++;
                return ((RequestMentalEffect)skill).type.Equals("MentalEffect");
            })
            .Select(skill => 
            {
                var mentalEffect = (RequestMentalEffect) skill;
                var newMentalEffect = new MentalEffect()
                {
                    Id = Guid.NewGuid(),  // Assuming a new ID is generated
                    Effect = mentalEffect.effect,
                    Type = mentalEffect.type,
                    Index = count,
                    SavedSkillId = SaveSkillId // Assuming SaveSkillId is available in scope
                };
                return newMentalEffect;
            });
            return newSkills;
        }
    }

   
}