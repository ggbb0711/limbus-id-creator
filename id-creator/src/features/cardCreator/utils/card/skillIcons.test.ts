import fs from 'fs'
import path from 'path'
import { getSkillLevelIcon, getSkillPowerIcon } from './skillIcons'
import { DAMAGE_TYPES, DEFENSE_TYPES } from 'features/cardCreator/constants'
import { createOffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { createDefenseSkill } from 'features/cardCreator/types/skills/defenseSkill/IDefenseSkill'

const publicFile = (src: string) => path.join(process.cwd(), 'public', src)

describe('skill icons', () => {
    it('offense skills show their damage type and the attack level icon', () => {
        const skill = createOffenseSkill({ damageType: 'Pierce' })
        expect(getSkillPowerIcon(skill)).toEqual({ src: '/Images/attack/attackt_Pierce.webp', alt: 'Pierce_icon' })
        expect(getSkillLevelIcon(skill).src).toBe('/Images/stat/stat_attack.webp')
    })

    it.each([
        ['Block', '/Images/defense/defense_Block.webp', '/Images/stat/stat_defense.webp'],
        ['Dodge', '/Images/defense/defense_Dodge.webp', '/Images/stat/stat_defense.webp'],
        ['ClashableGuard', '/Images/defense/defense_Block.webp', '/Images/stat/stat_defense.webp'],
        ['Counter', '/Images/attack/attackt_Blunt.webp', '/Images/stat/stat_attack.webp'],
        ['ClashableCounter', '/Images/attack/attackt_Blunt.webp', '/Images/stat/stat_attack.webp'],
    ] as const)('defense type %s', (defenseType, power, level) => {
        const skill = createDefenseSkill({ defenseType, damageType: 'Blunt' })
        expect(getSkillPowerIcon(skill).src).toBe(power)
        expect(getSkillLevelIcon(skill).src).toBe(level)
    })

    it('only points at icons that exist', () => {
        const skills = [
            ...DAMAGE_TYPES.map(damageType => createOffenseSkill({ damageType })),
            ...DEFENSE_TYPES.flatMap(defenseType => DAMAGE_TYPES.map(damageType => createDefenseSkill({ defenseType, damageType }))),
        ]
        skills.forEach(skill => {
            expect(fs.existsSync(publicFile(getSkillPowerIcon(skill).src))).toBe(true)
            expect(fs.existsSync(publicFile(getSkillLevelIcon(skill).src))).toBe(true)
        })
    })
})
