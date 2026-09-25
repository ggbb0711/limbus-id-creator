import React from "react";
import type { Metadata } from "next";
import PrivacyPolicyPage from "features/static/privacyPolicyPage/PrivacyPolicyPage";

export const metadata: Metadata = {
    title: "Privacy Policy",
    alternates: { canonical: "/privacy-policy" },
}

export default function Page() {
    return <PrivacyPolicyPage />
}
