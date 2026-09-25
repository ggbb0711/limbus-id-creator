import React from "react";
import type { Metadata } from "next";
import { EgoCreator } from "features/cardCreator/pages/CreatorClient";

export const metadata: Metadata = {
    title: "E.G.O Creator",
    description: "Design a custom Limbus Company E.G.O card: sin cost, skills, passives and splash art.",
    alternates: { canonical: "/creator/ego" },
}

export default function Page() {
    return <EgoCreator />
}
