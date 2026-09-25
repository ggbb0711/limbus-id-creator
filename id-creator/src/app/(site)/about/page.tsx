import React from "react";
import type { Metadata } from "next";
import AboutPage from "features/static/aboutPage/AboutPage";

export const metadata: Metadata = {
    title: "About",
    alternates: { canonical: "/about" },
}

export default function Page() {
    return <AboutPage />
}
