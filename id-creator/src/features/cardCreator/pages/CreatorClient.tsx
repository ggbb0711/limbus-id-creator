'use client'
import React from "react";
import dynamic from "next/dynamic";

function Loading() {
    return <div className="center-element-vertically" style={{ flex: 1 }}><div className="loader" /></div>
}

const CardEditorPage = dynamic(() => import("./CardEditorPage"), { ssr: false, loading: Loading })

export const IdCreator = () => <CardEditorPage mode="id" />
export const EgoCreator = () => <CardEditorPage mode="ego" />
