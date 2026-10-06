'use client'
import dynamic from "next/dynamic";
import Spinner from "components/ui/spinner/Spinner";

function Loading() {
    return <div className="center-element-vertically" style={{ flex: 1 }}><Spinner /></div>
}

const CardEditorPage = dynamic(() => import("./CardEditorPage"), { ssr: false, loading: Loading })

export const IdCreator = () => <CardEditorPage mode="id" />
export const EgoCreator = () => <CardEditorPage mode="ego" />
