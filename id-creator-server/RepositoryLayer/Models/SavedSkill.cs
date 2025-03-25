using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using RepositoryLayer.Utils.UtilInterfaces;

namespace RepositoryLayer.Models
{
    [Owned]
    [PrimaryKey(nameof(Id))]
    public class SavedSkill
    {
        private ICollection<OffenseSkill> _offenseSkills = new List<OffenseSkill>();
        private ICollection<DefenseSkill> _defenseSkills = new List<DefenseSkill>();
        private ICollection<PassiveSkill> _passiveSkills = new List<PassiveSkill>();
        private ICollection<MentalEffect> _mentalEffects = new List<MentalEffect>();
        private ICollection<CustomEffect> _customEffects = new List<CustomEffect>();
        private ILazyLoader LazyLoader { get; set; }

        public SavedSkill() { }

        private SavedSkill(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }

        public Guid Id { get; set; }

        public virtual ICollection<OffenseSkill> OffenseSkills
        {
            get => LazyLoader.Load(this, ref _offenseSkills) ?? new List<OffenseSkill>();
            set => _offenseSkills = value;
        }

        public virtual ICollection<DefenseSkill> DefenseSkills
        {
            get => LazyLoader.Load(this, ref _defenseSkills) ?? new List<DefenseSkill>();
            set => _defenseSkills = value;
        }

        public virtual ICollection<PassiveSkill> PassiveSkills
        {
            get => LazyLoader.Load(this, ref _passiveSkills) ?? new List<PassiveSkill>();
            set => _passiveSkills = value;
        }

        public virtual ICollection<MentalEffect> MentalEffects
        {
            get => LazyLoader.Load(this, ref _mentalEffects) ?? new List<MentalEffect>();
            set => _mentalEffects = value;
        }

        public virtual ICollection<CustomEffect> CustomEffects
        {
            get => LazyLoader.Load(this, ref _customEffects) ?? new List<CustomEffect>();
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
                    case "OffenseSkill":
                        decompileSkill.OffenseSkills.Add((OffenseSkill)skill);
                        break;
                    case "DefenseSkill":
                        decompileSkill.DefenseSkills.Add((DefenseSkill)skill);
                        break;
                    case "PassiveSkill":
                        decompileSkill.PassiveSkills.Add((PassiveSkill)skill);
                        break;
                    case "CustomEffect":
                        decompileSkill.CustomEffects.Add((CustomEffect)skill);
                        break;
                    case "MentalEffect":
                        decompileSkill.MentalEffects.Add((MentalEffect)skill);
                        break;
                }
            });
            return decompileSkill;
        }

        public static List<object> CompileSkill(SavedSkill skills)
        {
            List<object> combinedCollection =  new List<object>();

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