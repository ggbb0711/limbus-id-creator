import { appConfig } from "config/env.client"
import { egoInfoSlice } from "features/cardCreator/stores/EgoInfoSlice"
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo"
import { migrateEgoInfo } from "features/cardCreator/utils/save/migrateCardInfo"
import EgoPreviewBody from "features/cardCreator/components/card/previewBodies/EgoPreviewBody"
import { EgoStatsSection } from "features/cardCreator/components/inputTab/inputStatPage/statFields/EgoStatFields"
import { defineCardEditor } from "./CardEditorDefinition"

export const egoEditor = defineCardEditor<IEgoInfo>({
    kind: "ego",
    label: "E.G.O",
    generalSectionTitle: "Ego General Info",
    saveMode: "EGO",
    actions: egoInfoSlice.actions,
    select: state => state.egoInfo,
    migrate: migrateEgoInfo,
    uploadLimits: {
        sinnerIcon: appConfig.limits.upload.egoSinnerIcon,
        splashArt: appConfig.limits.upload.egoSplashArt,
    },
    iconPickerClass: "sinner-ego-icon",
    PreviewBody: EgoPreviewBody,
    StatsSection: EgoStatsSection,
})
