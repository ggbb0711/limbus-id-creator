import { SINNERS, SINNER_DEFINITIONS } from './constants'
import { SINNER_COLOR_GROUP } from './components/colorPicker/ColorPresets'

const files = ['Yi_Sang', 'Faust', 'Don_Quixote', 'Ryoshu', 'Meursault', 'Hong_Lu', 'Heathcliff', 'Ishmael', 'Sinclair', 'Rodion', 'Outis', 'Gregor']
const colorVars = ['--Yi-Sang-color', '--Faust-color', '--Don-color', '--Ryōshū-color', '--Meursault-color', '--Hong-Lu-color', '--Heathcliff-color', '--Ishmael-color', '--Sinclair-color', '--Rodya-color', '--Outis-color', '--Gregor-color']
const labels = ['Yi Sang', 'Faust', 'Don Quixote', 'Ryōshū', 'Meursault', 'Hong Lu', 'Heathcliff', 'Ishmael', 'Sinclair', 'Rodion', 'Outis', 'Gregor']

describe('SINNER_DEFINITIONS', () => {
    it('lists the twelve sinners in order', () => {
        expect(SINNER_DEFINITIONS.map(sinner => sinner.key)).toEqual(files)
    })

    it('has unique keys and color variables', () => {
        expect(new Set(SINNER_DEFINITIONS.map(sinner => sinner.key)).size).toBe(12)
        expect(new Set(SINNER_DEFINITIONS.map(sinner => sinner.colorVar)).size).toBe(12)
    })
})

describe('SINNERS', () => {
    it('keeps the icon paths, alt text and colors', () => {
        expect(SINNERS).toEqual(files.map((file, i) => ({
            src: `/Images/sinner-icon/${file}_Icon.webp`,
            alt: `${file}_Icon.webp`,
            color: `var(${colorVars[i]})`,
        })))
    })
})

describe('SINNER_COLOR_GROUP', () => {
    it('keeps the labels and css variables', () => {
        expect(SINNER_COLOR_GROUP.title).toBe('Sinner colors')
        expect(SINNER_COLOR_GROUP.presets).toEqual(labels.map((label, i) => ({ label, cssVar: colorVars[i] })))
    })
})
