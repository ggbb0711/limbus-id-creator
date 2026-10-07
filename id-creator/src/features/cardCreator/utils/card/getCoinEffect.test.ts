import { MAX_DRAWN_COINS, getCoinEffect, getCoinEffects } from './getCoinEffect'

const unbreakable = (n: number) => `<span data-custom-coin-effect="coin-effect-${n}-unbreakable">U</span>`
const excision = (n: number) => `<span data-custom-coin-effect='coin-effect-${n}-excision'>E</span>`
const custom = (n: number) =>
    `<span data-custom-coin-effect='coin-effect-${n}-custom-burn' style='color: red;'><img class='status-icon' src='/burn.webp' />Burn</span>`

describe('getCoinEffect', () => {
    it('detects unbreakable and excision coins', () => {
        expect(getCoinEffect(unbreakable(1), 1)).toEqual({ type: 'unbreakable' })
        expect(getCoinEffect(excision(2), 2)).toEqual({ type: 'excision' })
    })

    it('reads custom coins from the markup', () => {
        expect(getCoinEffect(custom(3), 3)).toEqual({ type: 'custom', name: 'Burn', color: 'red', imageSrc: '/burn.webp' })
    })

    it('falls back to a normal coin', () => {
        expect(getCoinEffect('', 1)).toEqual({ type: 'normal' })
        expect(getCoinEffect(unbreakable(2), 1)).toEqual({ type: 'normal' })
    })
})

describe('getCoinEffects', () => {
    it('returns one effect per coin', () => {
        expect(getCoinEffects(unbreakable(2), 3)).toEqual([{ type: 'normal' }, { type: 'unbreakable' }, { type: 'normal' }])
    })

    it('collapses to a single coin above the limit', () => {
        expect(getCoinEffects('', MAX_DRAWN_COINS)).toHaveLength(MAX_DRAWN_COINS)
        expect(getCoinEffects('', MAX_DRAWN_COINS + 1)).toEqual([{ type: 'normal' }])
    })

    it('returns nothing for zero or negative coins', () => {
        expect(getCoinEffects('', 0)).toEqual([])
        expect(getCoinEffects('', -2)).toEqual([])
    })
})
