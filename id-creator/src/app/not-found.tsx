import type { Metadata } from "next";
import SiteShell from "components/layout/SiteShell";
import NotFoundPage from "components/notFound/notFoundPage/NotFoundPage";

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
    return <SiteShell><NotFoundPage /></SiteShell>
}
