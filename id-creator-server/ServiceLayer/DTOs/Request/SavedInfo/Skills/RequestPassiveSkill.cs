using RepositoryLayer.Utils.UtilInterfaces;

namespace ServiceLayer.DTOs.Request.SavedInfo.Skills
{
    public class RequestPassiveSkill:IRequestSkillType
    {
        public string skillLabel { get; set; } = "PASSIVE";
        public Guid inputId { get; set; } 
        public string name { get; set; } = "";
        public string skillEffect { get; set; } = "";
        public string type { get; set; } = "PassiveSkill";
        public string affinity { get; set; } = "Wrath";
        public string req { get; set; } = "Own"; // Res or own or none
        public int reqNo { get; set; } = 1;
        public PassiveSinCost ownCost { get; set; } = new PassiveSinCost();
        public PassiveSinCost resCost { get; set; } = new PassiveSinCost();
    }

    public class PassiveSinCost{
        public int wrath_cost { get; set; } = 0;
        public int lust_cost { get; set; } = 0;
        public int sloth_cost { get; set; } = 0;
        public int gluttony_cost { get; set; } = 0;
        public int gloom_cost { get; set; } = 0;
        public int pride_cost { get; set; } = 0;
        public int envy_cost { get; set; } = 0;
    }
}