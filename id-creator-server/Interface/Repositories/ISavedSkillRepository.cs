using Server.Models;

namespace Server.Interface.Repositories
{
    public interface ISavedSkillRepository : IRepository<SavedSkill>
    {
        Task<SavedSkill?> UpdateSavedSkill(SavedSkill incomingSkills);
    }
}