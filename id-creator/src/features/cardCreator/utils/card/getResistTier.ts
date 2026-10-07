export type ResistTier = "Ineff" | "Endure" | "Normal" | "Weak" | "Fatal"

export interface ResistDisplay {
    label: ResistTier
    color: string
}

export function getResistTier(value: number): ResistDisplay {
    if (value <= 0.5) return  { label: "Ineff", color: "var(--Ineff)" }
    if (value < 1) return  { label: "Endure", color: "var(--Endure)" }
    if (value === 1) return  { label: "Normal", color: "var(--Normal)" }
    if (value < 1.5) return  { label: "Weak", color: "var(--Weak)" }
    return { label: "Fatal", color: "var(--Fatal)" }
}
