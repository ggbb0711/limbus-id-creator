import React from "react";
import Link from "next/link";
import "./AboutPage.css";
import { SITE_LINKS } from "config/siteLinks";
import LegalSection, { ExternalLink } from "features/static/components/legalSection/LegalSection";

export default function AboutPage() {
    return (
        <div className="page-container">
            <div className="page-content about-page-content legal-page-content">
                <h1 className="page-title">About</h1>
                <p className="about-intro">
                    Limbus ID Creator is a fan-made tool for the community of{" "}
                    <ExternalLink href={SITE_LINKS.limbusCompany}>Limbus Company</ExternalLink>
                    . It allows you to design and share custom Identity and E.G.O cards inspired by the game.
                </p>

                <LegalSection title="Creator Tools">
                    Use our{" "}
                    <Link href="/creator/identity" className="legal-link">Identity Creator</Link>
                    {" "}to design custom Identity cards, or the{" "}
                    <Link href="/creator/ego" className="legal-link">E.G.O Creator</Link>
                    {" "}to craft your own E.G.O cards. Customize artwork, stats, skills, and more.
                </LegalSection>

                <LegalSection title="Community">
                    Share your creations and discuss ideas with others on our{" "}
                    <Link href="/forum" className="legal-link">Forum</Link>
                    . Browse what the community has made and get inspired for your next creation.
                </LegalSection>

                <LegalSection title="Disclaimer">
                    This is an unofficial fan project and is not affiliated with or endorsed by Project Moon.
                    All game-related assets and trademarks belong to their respective owners. For more information, see{" "}
                    <ExternalLink href={SITE_LINKS.fanContentPolicy}>Project Moon&apos;s Fan Content Policy</ExternalLink>.
                </LegalSection>

                <LegalSection title="Support">
                    If you enjoy this project and want to support its development, consider buying us a coffee on{" "}
                    <ExternalLink href={SITE_LINKS.kofi}>Ko-fi</ExternalLink>
                    . Your support helps keep this project running and free for everyone.
                </LegalSection>
            </div>
        </div>
    );
}
