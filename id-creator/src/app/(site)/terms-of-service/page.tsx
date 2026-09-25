import React from "react";
import type { Metadata } from "next";
import TermsOfServicePage from "features/static/termsOfServicePage/TermsOfServicePage";

export const metadata: Metadata = {
    title: "Terms of Service",
    alternates: { canonical: "/terms-of-service" },
}

export default function Page() {
    return <TermsOfServicePage />
}
