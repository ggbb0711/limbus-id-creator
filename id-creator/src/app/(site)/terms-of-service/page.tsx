import React from "react";
import type { Metadata } from "next";
import TermsOfServicePage from "features/static/termsOfServicePage/TermsOfServicePage";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "Terms of Service",
    description: "The terms that apply when you use Limbus ID Creator and share content on it.",
    path: "/terms-of-service",
})

export default function Page() {
    return <TermsOfServicePage />
}
