'use client'
import dynamic from "next/dynamic";
import Spinner from "components/ui/spinner/Spinner";
import { CardKind } from "features/cardCreator/editors/CardEditorDefinition";

function Loading() {
    return <div className="center-element-vertically" style={{ flex: 1 }}><Spinner /></div>
}

const KindEditor = dynamic(() => import("./KindEditor"), { ssr: false, loading: Loading })

const editorFor = (kind: CardKind) => function Creator() {
    return <KindEditor kind={kind} />
}

export const IdCreator = editorFor("id")
export const EgoCreator = editorFor("ego")
