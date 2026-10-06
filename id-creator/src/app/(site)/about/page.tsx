import React from "react";
import type { Metadata } from "next";
import AboutPage from "features/static/aboutPage/AboutPage";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "About",
    description: "Learn about Limbus ID Creator, a fan-made tool for designing and sharing custom Limbus Company Identity and E.G.O cards.",
    path: "/about",
})

export default function Page() {
    return <AboutPage />
}
