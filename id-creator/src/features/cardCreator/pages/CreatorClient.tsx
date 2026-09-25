'use client'
import React from "react";
import dynamic from "next/dynamic";

function Loading() {
    return <div className="center-element-vertically" style={{ flex: 1 }}><div className="loader" /></div>
}

export const IdCreator = dynamic(() => import("./IdCardPage"), { ssr: false, loading: Loading })
export const EgoCreator = dynamic(() => import("./EgoCardPage"), { ssr: false, loading: Loading })
