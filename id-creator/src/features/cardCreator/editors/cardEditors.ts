import { SaveMode } from "features/cardCreator/constants"
import { CardEditorDefinition, CardKind } from "./CardEditorDefinition"
import { egoEditor } from "./egoEditor"
import { idEditor } from "./idEditor"

export const CARD_EDITORS: Readonly<Record<CardKind, CardEditorDefinition>> = { id: idEditor, ego: egoEditor }

export const editorForSaveMode = (saveMode: SaveMode): CardEditorDefinition =>
    Object.values(CARD_EDITORS).find(editor => editor.saveMode === saveMode) ?? idEditor
