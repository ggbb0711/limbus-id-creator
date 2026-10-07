export const PANEL_MIN_WIDTH = 240
export const PANEL_MAX_WIDTH = 700
export const PANEL_DEFAULT_WIDTH = 400

export type PanelResize = { kind: "close" } | { kind: "resize"; width: number }

export function parseSavedWidth(raw: string | null, min = PANEL_MIN_WIDTH, max = PANEL_MAX_WIDTH, fallback = PANEL_DEFAULT_WIDTH): number {
    if (raw === null || raw.trim() === "") return fallback
    const width = Number(raw)
    return Number.isFinite(width) && width >= min && width <= max ? width : fallback
}

export function clampPanelWidth(width: number, min = PANEL_MIN_WIDTH, max = PANEL_MAX_WIDTH): PanelResize {
    return width < min ? { kind: "close" } : { kind: "resize", width: Math.min(width, max) }
}
