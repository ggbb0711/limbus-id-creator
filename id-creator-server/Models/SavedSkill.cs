using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Server.Interface.UtilInterfaces;
using Server.Util.Enums;

namespace Server.Models
{
    [Owned]
    [PrimaryKey(nameof(Id))]
    public class SavedSkill
    {
        private ICollection<OffenseSkill>? _offenseSkills = [];
        private ICollection<DefenseSkill>? _defenseSkills = [];
        private ICollection<PassiveSkill>? _passiveSkills = [];
        private ICollection<MentalEffect>? _mentalEffects = [];
        private ICollection<CustomEffect>? _customEffects = [];
        private ILazyLoader LazyLoader { get; set; } = null!;

        public SavedSkill() { }

        private SavedSkill(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }

        public virtual ICollection<OffenseSkill> OffenseSkills
        {
            get => LazyLoader.Load(this, ref _offenseSkills ) ?? [];
            set => _offenseSkills = value;
        }

        public virtual ICollection<DefenseSkill> DefenseSkills
        {
            get => LazyLoader.Load(this, ref _defenseSkills) ?? [];
            set => _defenseSkills = value;
        }

        public virtual ICollection<PassiveSkill> PassiveSkills
        {
            get => LazyLoader.Load(this, ref _passiveSkills) ?? [];
            set => _passiveSkills = value;
        }

        public virtual ICollection<MentalEffect> MentalEffects
        {
            get => LazyLoader.Load(this, ref _mentalEffects) ?? [];
            set => _mentalEffects = value;
        }

        public virtual ICollection<CustomEffect> CustomEffects
        {
            get => LazyLoader.Load(this, ref _customEffects) ?? [];
            set => _customEffects = value;
        }
        public static SavedSkill DeCompileSkill(List<object> skills)
        {
            SavedSkill decompileSkill = new();
            skills.ForEach(skill=>
            {
                var skillType =((ISkillType) skill).Type;
                switch(skillType)
                {
                    case SkillType.OffenseSkill:
                        decompileSkill.OffenseSkills.Add((OffenseSkill)skill);
                        break;
                    case SkillType.DefenseSkill:
                        decompileSkill.DefenseSkills.Add((DefenseSkill)skill);
                        break;
                    case SkillType.PassiveSkill:
                        decompileSkill.PassiveSkills.Add((PassiveSkill)skill);
                        break;
                    case SkillType.CustomEffect:
                        decompileSkill.CustomEffects.Add((CustomEffect)skill);
                        break;
                    case SkillType.MentalEffect:
                        decompileSkill.MentalEffects.Add((MentalEffect)skill);
                        break;
                }
            });
            return decompileSkill;
        }

        public static List<ISkillType> CompileSkill(SavedSkill skills)
        {
            List<ISkillType> combinedCollection =  [];

            if (skills.OffenseSkills != null)
            {
                foreach (var item in skills.OffenseSkills)
                {
                    combinedCollection.Add(item);
                }
            }

            if (skills.DefenseSkills != null)
            {
                foreach (var item in skills.DefenseSkills)
                {
                    combinedCollection.Add(item);
                }
            }

            if (skills.PassiveSkills != null)
            {
                foreach (var item in skills.PassiveSkills)
                {
                    combinedCollection.Add(item);
                }
            }

            if (skills.MentalEffects != null)
            {
                foreach (var item in skills.MentalEffects)
                {
                    combinedCollection.Add(item);
                }
            }

            if (skills.CustomEffects != null)
            {
                foreach (var item in skills.CustomEffects)
                {
                    combinedCollection.Add(item);
                }
            }

            return [.. combinedCollection.OrderBy(skill=>((ISkillIndex)skill).Index)];
        }
    }
}