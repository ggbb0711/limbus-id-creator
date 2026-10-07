import { appConfig } from "config/env.client"
import { idInfoSlice } from "features/cardCreator/stores/IdInfoSlice"
import { IIdInfo } from "features/cardCreator/types/IIdInfo"
import { migrateIdInfo } from "features/cardCreator/utils/save/migrateCardInfo"
import IdPreviewBody from "features/cardCreator/components/card/previewBodies/IdPreviewBody"
import { IdGeneralFields, IdStatsSection } from "features/cardCreator/components/inputTab/inputStatPage/statFields/IdStatFields"
import { defineCardEditor } from "./CardEditorDefinition"

export const idEditor = defineCardEditor<IIdInfo>({
    kind: "id",
    label: "Identity",
    generalSectionTitle: "Sinner General Info",
    saveMode: "ID",
    actions: idInfoSlice.actions,
    select: state => state.idInfo,
    migrate: migrateIdInfo,
    uploadLimits: {
        sinnerIcon: appConfig.limits.upload.idSinnerIcon,
        splashArt: appConfig.limits.upload.idSplashArt,
    },
    iconPickerClass: "sinner-icon",
    PreviewBody: IdPreviewBody,
    GeneralFields: IdGeneralFields,
    StatsSection: IdStatsSection,
})
