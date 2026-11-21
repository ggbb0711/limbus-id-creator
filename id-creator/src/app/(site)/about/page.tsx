import AdsenseScript from "components/ads/AdsenseScript";
import React from "react";
import type { Metadata } from "next";
import AboutPage from "features/static/aboutPage/AboutPage";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "About",
    description: "How Limbus ID Creator works and is run: the card editors, the forum, moderation, what data is stored, and how to get in touch.",
    path: "/about",
})

export default function Page() {
    return <>
        <AdsenseScript/>
        <AboutPage />
    </>
}
