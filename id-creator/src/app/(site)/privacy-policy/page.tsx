import React from "react";
import type { Metadata } from "next";
import PrivacyPolicyPage from "features/static/privacyPolicyPage/PrivacyPolicyPage";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "Privacy Policy",
    description: "How Limbus ID Creator collects, uses and protects your information.",
    path: "/privacy-policy",
})

export default function Page() {
    return <PrivacyPolicyPage />
}
