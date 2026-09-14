using Server.Shared.Model;
using Server.Shared.Repository;

namespace Server.Features.SaveInfo.Repository
{
    public interface ISavedSkillRepository : IRepository<SavedSkill>
    {
        Task<SavedSkill> UpdateSavedSkill(SavedSkill oldSavedSkill, SavedSkill incomingSkills);
    }
}
