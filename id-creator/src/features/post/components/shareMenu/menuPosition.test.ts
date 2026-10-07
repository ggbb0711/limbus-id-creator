import { MENU_GAP, VIEWPORT_MARGIN, menuPosition } from './menuPosition'

const viewport = { width: 1000, height: 800 }
const menu = { width: 200, height: 220 }

describe('menuPosition', () => {
    it('opens below the trigger, aligned to its left edge', () => {
        expect(menuPosition({ top: 100, bottom: 130, left: 300 }, menu, viewport)).toEqual({ top: 130 + MENU_GAP, left: 300 })
    })

    it('flips above when there is no room below', () => {
        expect(menuPosition({ top: 700, bottom: 730, left: 300 }, menu, viewport).top).toBe(700 - MENU_GAP - 220)
    })

    it('stays below when there is no room above either', () => {
        expect(menuPosition({ top: 100, bottom: 130, left: 300 }, menu, { width: 1000, height: 200 }).top).toBe(130 + MENU_GAP)
    })

    it('keeps the menu inside the viewport horizontally', () => {
        expect(menuPosition({ top: 0, bottom: 20, left: 950 }, menu, viewport).left).toBe(1000 - 200 - VIEWPORT_MARGIN)
        expect(menuPosition({ top: 0, bottom: 20, left: -40 }, menu, viewport).left).toBe(VIEWPORT_MARGIN)
    })
})
