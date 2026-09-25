import React from "react";
import type { Metadata } from "next";
import { IdCreator } from "features/cardCreator/pages/CreatorClient";

export const metadata: Metadata = {
    title: "Identity Creator",
    description: "Design a custom Limbus Company Identity card: stats, skills, passives and splash art.",
    alternates: { canonical: "/creator/identity" },
}

export default function Page() {
    return <IdCreator />
}
