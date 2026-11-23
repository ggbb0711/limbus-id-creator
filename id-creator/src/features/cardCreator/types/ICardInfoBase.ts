import { SkillDetail } from "./SkillDetail"
import { CardLayout } from "features/cardCreator/constants"

export interface ISplashArtTranslation {
    x: number
    y: number
}

export interface ICardInfoBase {
    title: string
    name: string
    splashArt: string
    splashArtScale: number
    splashArtTranslation: ISplashArtTranslation
    sinnerColor: string
    sinnerIcon: string
    skillDetails: SkillDetail[]
    cardLayout: CardLayout
    cardWidth: number
    cardHeight: number
    localSaveId: 1
    schemaVersion?: number
}

export const createCardInfoBaseDefaults = (): Omit<ICardInfoBase, "skillDetails"> => ({
    title: "",
    name: "",
    splashArt: "",
    splashArtScale: 1,
    splashArtTranslation: { x: 0, y: 0 },
    sinnerColor: "var(--Yi-Sang-color)",
    sinnerIcon: "/Images/sinner-icon/Yi_Sang_Icon.webp",
    cardLayout: "Horizontal",
    cardWidth: 1440,
    cardHeight: 1000,
    localSaveId: 1,
})
