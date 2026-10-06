import type { ComponentType, ReactNode } from "react"
import type { UnknownAction } from "@reduxjs/toolkit"
import type { UseFormReturn } from "react-hook-form"
import type { RootState } from "stores/AppStore"
import type { SaveMode } from "features/cardCreator/constants"
import type { CardInfo } from "features/cardCreator/types/CardInfo"
import type { ICardInfoBase } from "features/cardCreator/types/ICardInfoBase"
import type { RegisterNumber } from "features/cardCreator/hooks/useNumberRegister"
import type { CardField, CardSliceActions, CardState, SkillActions } from "features/cardCreator/stores/createCardSlice"

export type CardKind = "id" | "ego"

export type BaseCardField = CardField<ICardInfoBase>

export interface UploadLimits {
    sinnerIcon: number
    splashArt: number
}

export interface PreviewBodyProps<T extends CardInfo> {
    info: T
    skills: ReactNode
}

export interface StatFieldsProps<T extends CardInfo> {
    form: UseFormReturn<T>
    registerNumber: RegisterNumber<T>
}

export interface CardEditorConfig<T extends CardInfo> {
    kind: CardKind
    label: string
    generalSectionTitle: string
    saveMode: SaveMode
    actions: CardSliceActions<T>
    select(state: RootState): CardState<T>
    migrate(raw: unknown): T
    uploadLimits: UploadLimits
    iconPickerClass: string
    PreviewBody: ComponentType<PreviewBodyProps<T>>
    GeneralFields?: ComponentType<StatFieldsProps<T>>
    StatsSection: ComponentType<StatFieldsProps<T>>
}

export interface CardEditorDefinition {
    kind: CardKind
    label: string
    generalSectionTitle: string
    saveMode: SaveMode
    uploadLimits: UploadLimits
    iconPickerClass: string
    skillActions: SkillActions
    selectInfo(state: RootState): CardInfo
    selectLoadId(state: RootState): number
    migrate(raw: unknown): CardInfo
    load(raw: unknown): UnknownAction
    reset(): UnknownAction
    setInfo(info: CardInfo): UnknownAction
    updateBaseField<K extends BaseCardField>(field: K, value: ICardInfoBase[K]): UnknownAction
    PreviewBody: ComponentType<PreviewBodyProps<CardInfo>>
    GeneralFields?: ComponentType<StatFieldsProps<CardInfo>>
    StatsSection: ComponentType<StatFieldsProps<CardInfo>>
}

export function defineCardEditor<T extends CardInfo>(config: CardEditorConfig<T>): CardEditorDefinition {
    const { actions, select, migrate } = config
    return {
        kind: config.kind,
        label: config.label,
        generalSectionTitle: config.generalSectionTitle,
        saveMode: config.saveMode,
        uploadLimits: config.uploadLimits,
        iconPickerClass: config.iconPickerClass,
        skillActions: {
            addSkill: actions.addSkill,
            updateSkill: actions.updateSkill,
            deleteSkill: actions.deleteSkill,
            moveSkill: actions.moveSkill,
        },
        selectInfo: state => select(state).value,
        selectLoadId: state => select(state).loadId,
        migrate,
        load: raw => actions.loadInfo(migrate(raw)),
        reset: () => actions.resetInfo(),
        setInfo: info => actions.setInfo(info as T),
        updateBaseField: (field, value) => actions.updateField(field as unknown as CardField<T>, value as unknown as T[CardField<T>]),
        PreviewBody: config.PreviewBody as unknown as ComponentType<PreviewBodyProps<CardInfo>>,
        GeneralFields: config.GeneralFields as unknown as ComponentType<StatFieldsProps<CardInfo>> | undefined,
        StatsSection: config.StatsSection as unknown as ComponentType<StatFieldsProps<CardInfo>>,
    }
}
