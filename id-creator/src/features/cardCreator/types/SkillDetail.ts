import { ICustomEffect } from "./skills/customEffect/ICustomEffect"
import { IDefenseSkill } from "./skills/defenseSkill/IDefenseSkill"
import { IMentalEffect } from "./skills/mentalEffect/IMentalEffect"
import { IOffenseSkill } from "./skills/offenseSkill/IOffenseSkill"
import { IPassiveSkill } from "./skills/passiveSkill/IPassiveSkill"

export type SkillDetail = IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect
