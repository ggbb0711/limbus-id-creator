import React, { ReactNode } from "react";
import Header from "components/layout/header/Header";
import Footer from "components/layout/footer/Footer";
import "styles/PageLayout.css";

// Shared page frame (was MainLayout / CreatorLayout in the old React Router config).
export default function SiteShell({ children, footer = true }: { children: ReactNode, footer?: boolean }) {
    return (
        <div className="site-layout">
            <Header />
            <main className="site-content">{children}</main>
            {footer && <Footer />}
        </div>
    )
}
