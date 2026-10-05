export type ResistKind = "damage" | "sin"
export type ResistTier = "Ineff" | "Endure" | "Normal" | "Weak" | "Fatal"

export interface ResistDisplay {
    label: ResistTier
    color: string
}

function getLabel(value: number, kind: ResistKind): ResistTier {
    if (value <= 0.5) return "Ineff"
    if (value < 1) return "Endure"
    if (value >= 2) return "Fatal"
    if (kind === "damage" && value >= 1.5) return "Weak"
    return "Normal"
}

function getColor(value: number, kind: ResistKind): string {
    if (value < 1) return "var(--Endure)"
    if (value >= (kind === "damage" ? 1.5 : 2)) return "var(--Fatal)"
    return "var(--Normal)"
}

export function getResistTier(value: number, kind: ResistKind): ResistDisplay {
    return { label: getLabel(value, kind), color: getColor(value, kind) }
}
