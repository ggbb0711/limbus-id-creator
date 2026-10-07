export interface Box {
    top: number
    bottom: number
    left: number
}

export interface Size {
    width: number
    height: number
}

export const MENU_GAP = 4
export const VIEWPORT_MARGIN = 8

export function menuPosition(trigger: Box, menu: Size, viewport: Size): { top: number, left: number } {
    const below = trigger.bottom + MENU_GAP
    const above = trigger.top - MENU_GAP - menu.height
    const fitsBelow = below + menu.height <= viewport.height - VIEWPORT_MARGIN
    const top = fitsBelow || above < VIEWPORT_MARGIN ? below : above
    const maxLeft = Math.max(VIEWPORT_MARGIN, viewport.width - menu.width - VIEWPORT_MARGIN)
    return { top, left: Math.min(Math.max(VIEWPORT_MARGIN, trigger.left), maxLeft) }
}
