import React from "react";
import SiteShell from "components/layout/SiteShell";
import CreatorProviders from "features/cardCreator/CreatorProviders";
import "features/cardCreator/styles/EditorPage.css";

export default function CreatorLayout({ children }: LayoutProps<"/creator">) {
    return (
        <SiteShell footer={false}>
            <CreatorProviders>{children}</CreatorProviders>
        </SiteShell>
    )
}
