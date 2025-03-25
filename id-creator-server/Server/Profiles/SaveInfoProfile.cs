using AutoMapper;
using Newtonsoft.Json.Linq;
using RepositoryLayer.Models;
using ServiceLayer.DTOs.Request.SavedInfo;
using ServiceLayer.DTOs.Request.SavedInfo.SavedEgo;
using ServiceLayer.DTOs.Request.SavedInfo.SavedID;
using ServiceLayer.DTOs.Request.SavedInfo.Skills;
using ServiceLayer.DTOs.Response.SaveInfo;

namespace Server.Profiles
{
    public class SaveInfoProfile: Profile
    {
        public SaveInfoProfile()
        {
            CreateMap<SavedInfoRequestDTO<SavedEgoRequestDTO>, SavedEGOInfo>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src=>src.id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.saveName))
                .ForMember(dest => dest.SaveTime, opt => opt.MapFrom(src => DateTime.ParseExact(src.saveTime,"dd/MM/yyyy, HH:mm:ss",null)))
                .ForMember(dest => dest.ImageAttachId, opt => opt.MapFrom(src=>src.id))
                .ForMember(dest => dest.ImageAttach, opt => opt.MapFrom(src => new ImageObj(){
                    Id = src.id,
                    Url=src.previewImg,
                }))
                .ForMember(dest => dest.SavedEgo, opt => opt.MapFrom(src => MapSavedEgo(src)))
                .ForMember(dest => dest.SavedEgoKey, opt => opt.MapFrom(src=>src.id));
                
            CreateMap<SavedInfoRequestDTO<SavedIDRequestDTO>, SavedIDInfo>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src=>src.id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.saveName))
                .ForMember(dest => dest.SaveTime, opt => opt.MapFrom(src => DateTime.ParseExact(src.saveTime,"dd/MM/yyyy, HH:mm:ss",null)))
                .ForMember(dest => dest.ImageAttachId, opt => opt.MapFrom(src=>src.id))
                .ForMember(dest => dest.ImageAttach, opt => opt.MapFrom(src => new ImageObj(){
                    Id = src.id,
                    Url=src.previewImg,
                }))
                .ForMember(dest => dest.SavedId, opt => opt.MapFrom(src => MapSavedId(src)))
                .ForMember(dest => dest.SavedIdKey, opt => opt.MapFrom(src=>src.id));
        
            CreateMap<SavedEGOInfo,SaveInfoResponseDTO<SavedEgoRequestDTO>>()
                .ForMember(dest => dest.id, opt => opt.MapFrom(src=>src.Id))
                .ForMember(dest=>dest.saveName,opt=>opt.MapFrom(src => src.Name))
                .ForMember(dest=>dest.saveTime,opt=>opt.MapFrom(src=>src.SaveTime))
                .ForMember(dest=>dest.previewImg,opt=>opt.MapFrom(src=>src.ImageAttach.Url))
                .ForMember(dest=>dest.saveInfo,opt=>opt.MapFrom(src=>MapSavedEgoRequest(src.SavedEgo)));
        
            CreateMap<SavedIDInfo,SaveInfoResponseDTO<SavedIDRequestDTO>>()
                .ForMember(dest => dest.id, opt => opt.MapFrom(src=>src.Id))
                .ForMember(dest=>dest.saveName,opt=>opt.MapFrom(src => src.Name))
                .ForMember(dest=>dest.saveTime,opt=>opt.MapFrom(src=>src.SaveTime))
                .ForMember(dest=>dest.previewImg,opt=>opt.MapFrom(src=>src.ImageAttach.Url))
                .ForMember(dest=>dest.saveInfo,opt=>opt.MapFrom(src=>MapSavedIDRequest(src.SavedId)));
        }

        private SavedEgo MapSavedEgo(SavedInfoRequestDTO<SavedEgoRequestDTO> src)
        {
            var splashArtId = Guid.NewGuid();
            var SinnerIconId = Guid.NewGuid();
            return  new SavedEgo()
            {
                Id = src.id,
                Title = src.saveInfo.title,
                Name = src.saveInfo.name,
                SanityCost = src.saveInfo.sanityCost,
                SplashArtId = splashArtId,
                SplashArt = new ImageObj()
                {
                    Id = splashArtId,
                    Url = src.saveInfo.splashArt
                } ,
                SplashArtScale = src.saveInfo.splashArtScale,
                SplashArtTranslationX = src.saveInfo.splashArtTranslation.x,
                SplashArtTranslationY = src.saveInfo.splashArtTranslation.y,
                SinResistantWrath = src.saveInfo.sinResistant.wrath_resistant,
                SinResistantLust = src.saveInfo.sinResistant.lust_resistant,
                SinResistantSloth = src.saveInfo.sinResistant.sloth_resistant,
                SinResistantGluttony = src.saveInfo.sinResistant.gluttony_resistant,
                SinResistantGloom = src.saveInfo.sinResistant.gloom_resistant,
                SinResistantPride = src.saveInfo.sinResistant.pride_resistant,
                SinResistantEnvy = src.saveInfo.sinResistant.envy_resistant,
                SinCostWrath = src.saveInfo.sinCost.wrath_cost,
                SinCostLust = src.saveInfo.sinCost.lust_cost,
                SinCostSloth = src.saveInfo.sinCost.sloth_cost,
                SinCostGluttony = src.saveInfo.sinCost.gluttony_cost,
                SinCostGloom = src.saveInfo.sinCost.gloom_cost,
                SinCostPride = src.saveInfo.sinCost.pride_cost,
                SinCostEnvy = src.saveInfo.sinCost.envy_cost,
                SinnerColor = src.saveInfo.sinnerColor,
                SinnerIconId = SinnerIconId,
                SinnerIcon = new ImageObj()
                {
                    Id = SinnerIconId,
                    Url = src.saveInfo.sinnerIcon,
                } ,
                EgoLevel = src.saveInfo.egoLevel,
                SavedSkillId = src.id,
                Skill = MapNewSkill(src.id,src.saveInfo.skillDetails)
            };
        }

        private SavedId MapSavedId(SavedInfoRequestDTO<SavedIDRequestDTO> src)
        {
            var splashArtId = Guid.NewGuid();
            var SinnerIconId = Guid.NewGuid();
            return  new SavedId()
            {
                Id = src.id,
                Title = src.saveInfo.title,
                Name = src.saveInfo.name,
                SplashArtId = splashArtId,
                SplashArt = new ImageObj()
                {
                    Id = splashArtId,
                    Url = src.saveInfo.splashArt
                },
                SplashArtScale = src.saveInfo.splashArtScale,
                SplashArtTranslationX = src.saveInfo.splashArtTranslation.x,
                SplashArtTranslationY = src.saveInfo.splashArtTranslation.y,
                HP = src.saveInfo.hp,
                MinSpeed = src.saveInfo.minSpeed,
                MaxSpeed = src.saveInfo.maxSpeed,
                StaggerResist = src.saveInfo.staggerResist,
                DefenseLevel = src.saveInfo.defenseLevel,
                SinnerColor = src.saveInfo.sinnerColor,
                SinnerIconId = SinnerIconId,
                SinnerIcon = new ImageObj()
                {
                    Id = SinnerIconId,
                    Url = src.saveInfo.sinnerIcon,
                } ,
                SlashResistant = src.saveInfo.slashResistant,
                PierceResistant = src.saveInfo.pierceResistant,
                BluntResistant = src.saveInfo.bluntResistant,
                Rarity = src.saveInfo.rarity,
                SavedSkillId = src.id,
                Skill = MapNewSkill(src.id, src.saveInfo.skillDetails)
            };
        }

        private SavedEgoRequestDTO? MapSavedEgoRequest(SavedEgo src)
        {
            if(src==null) return null;
            return new SavedEgoRequestDTO()
            {
                title = src.Title,
                name = src.Name,
                sanityCost = src.SanityCost,
                splashArt = src.SplashArt.Url,
                splashArtScale = src.SplashArtScale,
                splashArtTranslation = new SplashArtTranslationObj()
                {
                    x = src.SplashArtTranslationX,
                    y = src.SplashArtTranslationY
                },
                sinResistant = new SavedEgoRequestDTO.SinResistantObj()
                {
                    wrath_resistant = src.SinResistantWrath,
                    lust_resistant = src.SinResistantLust,
                    sloth_resistant = src.SinResistantSloth,
                    gluttony_resistant = src.SinResistantGluttony,
                    gloom_resistant = src.SinResistantGloom,
                    envy_resistant = src.SinResistantEnvy,
                    pride_resistant = src.SinResistantPride,
                },
                sinCost = new SavedEgoRequestDTO.SinCostObj()
                {
                    wrath_cost = src.SinCostWrath,
                    lust_cost = src.SinCostLust,
                    sloth_cost = src.SinCostSloth,
                    gluttony_cost = src.SinCostGluttony,
                    gloom_cost = src.SinCostGloom,
                    envy_cost = src.SinCostEnvy,
                    pride_cost = src.SinCostPride,
                },
                sinnerColor = src.SinnerColor,
                sinnerIcon = src.SinnerIcon.Url,
                egoLevel = src.EgoLevel,
                skillDetails = MapSkillRequest(src.Skill)
            };
        }

        private SavedIDRequestDTO? MapSavedIDRequest(SavedId src)
        {
            if(src==null) return null;
            return new SavedIDRequestDTO()
            {
                title = src.Title,
                name = src.Name,
                splashArt = src.SplashArt.Url,
                splashArtScale = src.SplashArtScale,
                splashArtTranslation = new SplashArtTranslationObj()
                {
                    x = src.SplashArtTranslationX,
                    y = src.SplashArtTranslationY
                },
                hp = src.HP,
                minSpeed = src.MinSpeed,
                maxSpeed = src.MaxSpeed,
                staggerResist = src.StaggerResist,
                defenseLevel = src.DefenseLevel,
                sinnerColor = src.SinnerColor,
                sinnerIcon = src.SinnerIcon.Url,
                slashResistant = src.SlashResistant,
                pierceResistant = src.PierceResistant,
                bluntResistant = src.BluntResistant,
                rarity = src.Rarity,
                skillDetails = MapSkillRequest(src.Skill)
            };
        }

        private SavedSkill MapNewSkill(Guid SaveSkillId, List<object> skills)
        {
            var newSkills = new SavedSkill(){Id=SaveSkillId};
            ICollection<OffenseSkill> offenseSkills = [];
            ICollection<DefenseSkill> defenseSkills = [];
            ICollection<PassiveSkill> passiveSkills = [];
            ICollection<CustomEffect> customEffects = [];
            ICollection<MentalEffect> mentalEffects = [];
            for (int i = 0; i < skills.Count; i++)
            {
                var jObject = (JObject) skills[i];
                var type = jObject["type"]?.ToString();
                if(type.Equals("OffenseSkill"))
                {
                    var offenseSkill = jObject.ToObject<RequestOffenseSkill>();
                    var imageId = Guid.NewGuid();
                    var newOffenseSkill = new OffenseSkill()
                    {
                        Id = offenseSkill.inputId,
                        SkillLevel = offenseSkill.skillLevel,
                        SkillAmt = offenseSkill.skillAmt,
                        AtkWeight = offenseSkill.atkWeight,
                        DamageType = offenseSkill.damageType,
                        Name = offenseSkill.name,
                        SkillAffinity = offenseSkill.skillAffinity,
                        BasePower = offenseSkill.basePower,
                        CoinNo = offenseSkill.coinNo,
                        CoinPow = offenseSkill.coinPow,
                        ImageAttachId = imageId,
                        ImageAttach = new ImageObj()
                        {
                            Id = imageId,
                            Url = offenseSkill.skillImage
                        },
                        SkillEffect = offenseSkill.skillEffect,
                        SkillLabel = offenseSkill.skillLabel,
                        Type = offenseSkill.type,
                        Index = i,
                        SavedSkillId = SaveSkillId
                    };
                    offenseSkills.Add(newOffenseSkill);
                }
                if(type.Equals("DefenseSkill"))
                {
                    var defenseSkill = jObject.ToObject<RequestDefenseSkill>();
                    var imageId = Guid.NewGuid();
                    var newDefenseSkill = new DefenseSkill()
                    {
                        Id = defenseSkill.inputId,
                        SkillLevel = defenseSkill.skillLevel,
                        SkillAmt = defenseSkill.skillAmt,
                        AtkWeight = defenseSkill.atkWeight,
                        DefenseType = defenseSkill.defenseType,
                        DamageType = defenseSkill.damageType,
                        Name = defenseSkill.name,
                        SkillAffinity = defenseSkill.skillAffinity,
                        BasePower = defenseSkill.basePower,
                        CoinNo = defenseSkill.coinNo,
                        CoinPow = defenseSkill.coinPow,
                        ImageAttachId = imageId,
                        ImageAttach = new ImageObj()
                        {
                            Id = imageId,
                            Url = defenseSkill.skillImage
                        } ,
                        SkillEffect = defenseSkill.skillEffect,
                        SkillLabel = defenseSkill.skillLabel,
                        Type = defenseSkill.type,
                        Index = i,
                        SavedSkillId = SaveSkillId 
                    };
                    defenseSkills.Add(newDefenseSkill);
                }
                if(type.Equals("PassiveSkill"))
                {
                    var passiveSkill = jObject.ToObject<RequestPassiveSkill>();
                    var newPassiveSkill = new PassiveSkill()
                    {
                        Id = passiveSkill.inputId,
                        SkillLabel = passiveSkill.skillLabel,
                        Name = passiveSkill.name,
                        SkillEffect = passiveSkill.skillEffect,
                        Type = passiveSkill.type,
                        Affinity = passiveSkill.affinity,
                        Req = passiveSkill.req,
                        ReqNo = passiveSkill.reqNo,
                        Index = i,
                        SavedSkillId = SaveSkillId,
                        ReqOwnWrath = passiveSkill.ownCost.wrath_cost,
                        ReqOwnLust = passiveSkill.ownCost.lust_cost,
                        ReqOwnGloom = passiveSkill.ownCost.gloom_cost,
                        ReqOwnEnvy = passiveSkill.ownCost.envy_cost,
                        ReqOwnGluttony = passiveSkill.ownCost.gluttony_cost,
                        ReqOwnPride = passiveSkill.ownCost.pride_cost,
                        ReqOwnSloth = passiveSkill.ownCost.sloth_cost,
                        ReqResWrath = passiveSkill.resCost.wrath_cost,
                        ReqResLust = passiveSkill.resCost.lust_cost,
                        ReqResGloom = passiveSkill.resCost.gloom_cost,
                        ReqResEnvy = passiveSkill.resCost.envy_cost,
                        ReqResGluttony = passiveSkill.resCost.gluttony_cost,
                        ReqResPride = passiveSkill.resCost.pride_cost,
                        ReqResSloth = passiveSkill.resCost.sloth_cost,
                    };
                    passiveSkills.Add(newPassiveSkill);
                }
                if(type.Equals("CustomEffect"))
                {
                    var customEffect = jObject.ToObject<RequestCustomEffect>();
                    var imageId = Guid.NewGuid();
                    var newCustomEffect = new CustomEffect()
                    {
                        Id = customEffect.inputId, 
                        Name = customEffect.name,
                        ImageAttachId = imageId,
                        ImageAttach = new ImageObj()
                        {
                            Id = Guid.NewGuid(),
                            Url = customEffect.customImg
                        } ,
                        EffectColor = customEffect.effectColor,
                        Effect = customEffect.effect,
                        Type = customEffect.type,
                        Index = i,
                        SavedSkillId = SaveSkillId 
                    };
                    customEffects.Add(newCustomEffect);
                }
                if(type.Equals("MentalEffect"))
                {
                    var mentalEffect = jObject.ToObject<RequestMentalEffect>();
                    var newMentalEffect = new MentalEffect()
                    {
                        Id = mentalEffect.inputId,  // Assuming a new ID is generated
                        Effect = mentalEffect.effect,
                        Type = mentalEffect.type,
                        Index = i,
                        SavedSkillId = SaveSkillId // Assuming SaveSkillId is available in scope
                    };
                    mentalEffects.Add(newMentalEffect);
                }
            }
            newSkills.OffenseSkills = offenseSkills;
            newSkills.DefenseSkills = defenseSkills;
            newSkills.PassiveSkills = passiveSkills;
            newSkills.CustomEffects = customEffects;
            newSkills.MentalEffects = mentalEffects;
            return newSkills;
        }
        
        private List<object> MapSkillRequest(SavedSkill src)
        {
            var list = SavedSkill.CompileSkill(src);
            for(int i = 0; i < list.Count; i++)
            {
                if(list[i].GetType().Name.Equals("OffenseSkill")
                ||list[i].GetType().Name.Equals("OffenseSkillProxy"))
                {
                    var offenseSkill = (OffenseSkill) list[i];
                    list[i] = new RequestOffenseSkill()
                    {
                        skillLevel = offenseSkill.SkillLevel,
                        skillAmt = offenseSkill.SkillAmt,
                        atkWeight = offenseSkill.AtkWeight,
                        inputId = offenseSkill.Id,
                        damageType = offenseSkill.DamageType,
                        name = offenseSkill.Name,
                        skillAffinity = offenseSkill.SkillAffinity,
                        basePower = offenseSkill.BasePower,
                        coinNo = offenseSkill.CoinNo,
                        coinPow = offenseSkill.CoinPow,
                        skillImage = offenseSkill.ImageAttach.Url,
                        skillEffect = offenseSkill.SkillEffect,
                        skillLabel = offenseSkill.SkillLabel,
                    };
                }

                if(list[i].GetType().Name.Equals("DefenseSkill")
                ||list[i].GetType().Name.Equals("DefenseSkillProxy"))
                {
                    var defenseSkill = (DefenseSkill) list[i];
                    list[i] = new RequestDefenseSkill()
                    {
                        skillLevel = defenseSkill.SkillLevel,
                        skillAmt = defenseSkill.SkillAmt,
                        atkWeight = defenseSkill.AtkWeight,
                        inputId = defenseSkill.Id,
                        defenseType = defenseSkill.DefenseType,
                        damageType = defenseSkill.DamageType,
                        name = defenseSkill.Name,
                        skillAffinity = defenseSkill.SkillAffinity,
                        basePower = defenseSkill.BasePower,
                        coinNo = defenseSkill.CoinNo,
                        coinPow = defenseSkill.CoinPow,
                        skillImage = defenseSkill.ImageAttach.Url,
                        skillEffect = defenseSkill.SkillEffect,
                        skillLabel = defenseSkill.SkillLabel,
                    };
                }

                if(list[i].GetType().Name.Equals("PassiveSkill")
                ||list[i].GetType().Name.Equals("PassiveSkillProxy"))
                {
                    var PassiveSkill = (PassiveSkill) list[i];
                    list[i] = new RequestPassiveSkill()
                    {
                        inputId = PassiveSkill.Id,
                        name = PassiveSkill.Name,
                        skillEffect = PassiveSkill.SkillEffect,
                        skillLabel = PassiveSkill.SkillLabel,
                        affinity = PassiveSkill.Affinity,
                        req = PassiveSkill.Req,
                        reqNo = PassiveSkill.ReqNo,
                        ownCost = new PassiveSinCost(){
                            wrath_cost = PassiveSkill.ReqOwnWrath,
                            lust_cost = PassiveSkill.ReqOwnLust,
                            gluttony_cost = PassiveSkill.ReqOwnGluttony,
                            gloom_cost = PassiveSkill.ReqOwnGloom,
                            sloth_cost = PassiveSkill.ReqOwnSloth,
                            envy_cost = PassiveSkill.ReqOwnEnvy,
                            pride_cost = PassiveSkill.ReqOwnPride
                        },
                        resCost = new PassiveSinCost(){
                            wrath_cost = PassiveSkill.ReqResWrath,
                            lust_cost = PassiveSkill.ReqResLust,
                            gluttony_cost = PassiveSkill.ReqResGluttony,
                            gloom_cost = PassiveSkill.ReqResGloom,
                            sloth_cost = PassiveSkill.ReqResSloth,
                            envy_cost = PassiveSkill.ReqResEnvy,
                            pride_cost = PassiveSkill.ReqResPride
                        }
                    };
                }

                if(list[i].GetType().Name.Equals("CustomEffect")
                ||list[i].GetType().Name.Equals("CustomEffectProxy"))
                {
                    var customEffect = (CustomEffect) list[i];
                    list[i] = new RequestCustomEffect()
                    {
                        inputId = customEffect.Id,
                        name = customEffect.Name,
                        customImg = customEffect.ImageAttach.Url,
                        effectColor = customEffect.EffectColor,
                        effect = customEffect.Effect,
                    };
                }

                if(list[i].GetType().Name.Equals("MentalEffect")
                ||list[i].GetType().Name.Equals("MentalEffectProxy"))
                {
                    var mentalEffect = (MentalEffect) list[i];
                    list[i] = new RequestMentalEffect()
                    {
                        inputId = mentalEffect.Id,
                        effect = mentalEffect.Effect,
                    };
                }
            }

            return list;
        }
    }
}