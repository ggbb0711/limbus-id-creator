using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Server.DTOs.Request.SavedInfo.Skills;
using Server.Util.Enums;

namespace Server.Util.JsonConverter
{
    public class SkillRequestBaseConverter : JsonConverter<SkillRequestBase>
    {
        public override SkillRequestBase ReadJson(JsonReader reader, 
            Type objectType, 
            SkillRequestBase? existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            var type = jObject["type"]!.ToObject<SkillType>();
            SkillRequestBase target = type switch
            {
                SkillType.OffenseSkill => new RequestOffenseSkill(),
                SkillType.DefenseSkill => new RequestDefenseSkill(),
                SkillType.PassiveSkill => new RequestPassiveSkill(),
                SkillType.CustomEffect => new RequestCustomEffect(),
                SkillType.MentalEffect => new RequestMentalEffect(),
                _ => throw new JsonSerializationException($"Unkown skill type: {type}")
            };
            serializer.Populate(jObject.CreateReader(),target);
            return target;
        }

        public override void WriteJson(JsonWriter writer, SkillRequestBase? value, JsonSerializer serializer) 
            => serializer.Serialize(writer,value);
        public override bool CanWrite => false;
    }
}