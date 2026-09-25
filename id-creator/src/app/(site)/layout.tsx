import React from "react";
import SiteShell from "components/layout/SiteShell";

export default function SiteLayout({ children }: LayoutProps<"/">) {
    return <SiteShell>{children}</SiteShell>
}
