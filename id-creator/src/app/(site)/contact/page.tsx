import React from "react";
import type { Metadata } from "next";
import ContactPage from "features/static/contactPage/ContactPage";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "Contact",
    description: "Get in touch with the developer of Limbus ID Creator by email or Discord.",
    path: "/contact",
})

export default function Page() {
    return <ContactPage />
}
