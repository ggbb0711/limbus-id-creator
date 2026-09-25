import React from "react";
import type { Metadata, Viewport } from "next";
import "styles/reset.css";
import "styles/style.css";
import { mikodacs, rubik } from "styles/fonts";
import { siteMetadata } from "config/siteMetadata";
import Providers from "./providers";

export const metadata: Metadata = siteMetadata

export const viewport: Viewport = {
    themeColor: "#000000",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${rubik.variable} ${mikodacs.variable}`}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
