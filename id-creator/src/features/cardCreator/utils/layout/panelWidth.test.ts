import { PANEL_DEFAULT_WIDTH, clampPanelWidth, parseSavedWidth } from './panelWidth'

describe('parseSavedWidth', () => {
    it.each([null, '', 'abc', '100', '900'])('falls back for %p', raw => {
        expect(parseSavedWidth(raw)).toBe(PANEL_DEFAULT_WIDTH)
    })

    it('accepts widths inside the range', () => {
        expect(parseSavedWidth('240')).toBe(240)
        expect(parseSavedWidth('550')).toBe(550)
    })
})

describe('clampPanelWidth', () => {
    it('closes the panel below the minimum', () => {
        expect(clampPanelWidth(239)).toEqual({ kind: 'close' })
    })

    it('caps the width at the maximum', () => {
        expect(clampPanelWidth(500)).toEqual({ kind: 'resize', width: 500 })
        expect(clampPanelWidth(1200)).toEqual({ kind: 'resize', width: 700 })
    })
})
