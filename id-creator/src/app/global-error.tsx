'use client'
import React from "react";
import "styles/reset.css";
import "styles/style.css";
import RouteError, { RouteErrorProps } from "components/errorBoundary/RouteError";

// Replaces the root layout when it crashes, so it renders its own <html>/<body>.
// No next/font here: this is a client component (fonts fall back to sans-serif on this page).
export default function GlobalErrorPage(props: RouteErrorProps) {
    return (
        <html lang="en">
            <body>
                <RouteError {...props} />
            </body>
        </html>
    )
}
