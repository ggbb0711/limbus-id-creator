'use client'
import React, { ReactElement } from "react";
import { CARD_EDITORS } from "features/cardCreator/editors/cardEditors";
import { CardKind } from "features/cardCreator/editors/CardEditorDefinition";
import CardEditor from "./CardEditor";

export default function KindEditor({ kind }: { kind: CardKind }): ReactElement {
    return <CardEditor editor={CARD_EDITORS[kind]} />
}
