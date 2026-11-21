import React from "react";
import Link from "next/link";
import "./AboutPage.css";
import { SITE_LINKS } from "config/siteLinks";
import LegalSection, { ContactEmailLink, ExternalLink } from "features/static/components/legalSection/LegalSection";

export default function AboutPage() {
    return (
        <div className="page-container">
            <div className="page-content about-page-content legal-page-content">
                <h1 className="page-title">About</h1>
                <p className="about-intro">
                    Limbus ID Creator is a fan-made tool for players of{" "}
                    <ExternalLink href={SITE_LINKS.limbusCompany}>Limbus Company</ExternalLink>
                    . You can build custom Identity and E.G.O cards that look like the ones in the game, save them, export
                    them as images and share them with other players for feedback.
                </p>

                <LegalSection title="Creator Tools">
                    The <Link href="/creator/identity" className="legal-link">Identity Creator</Link> and the{" "}
                    <Link href="/creator/ego" className="legal-link">E.G.O Creator</Link> share one editor with a live card
                    preview. You set the stats, write skills, passives and custom status effects with the same keywords and
                    icons the game uses, and drag entries on the preview to reorder them. Your current card is autosaved in
                    your browser. Local saves keep named copies on your device, cloud saves keep them on your account so you
                    can open them anywhere, and the Download button exports the finished card as an image. The{" "}
                    <Link href="/blog/card-creator-guide" className="legal-link">Card Creator Guide</Link> covers every input.
                </LegalSection>

                <LegalSection title="Community">
                    The <Link href="/forum" className="legal-link">Forum</Link> is where finished cards are shared. A post
                    holds one to eight of your cloud saves, mixing Identities and E.G.Os, and the post page shows a full
                    summary of each card: stats, skills, passives and the descriptions of its custom status effects. Other
                    players can comment, and you can filter the forum by Sinner, status effect and other tags. Authors can
                    edit the description, tags and cards of their posts at any time, or delete them. See{" "}
                    <Link href="/blog/how-to-post-your-creation" className="legal-link">How to Share Your Creation</Link>{" "}
                    for the details.
                </LegalSection>

                <LegalSection title="How the Site Is Run">
                    Limbus ID Creator is an independent, unofficial fan project maintained by a single developer. It is free
                    to use, and there is no paid tier. Hosting, image storage and development are paid for by the ads shown
                    on content pages and by Ko-fi support. Ads are not shown inside the card editors. New status effects and
                    keywords are added to the editor as the game adds them, and missing ones can be suggested through the
                    contact details below.
                </LegalSection>

                <LegalSection title="Moderation">
                    Posts and comments are public, and everything shared on the site must follow the{" "}
                    <Link href="/terms-of-service" className="legal-link">Terms of Service</Link>. The site admin can remove
                    posts that break them and ban accounts that keep doing so. A removed post, or a post by a banned account,
                    shows a notice instead of its content. Authors can also delete their own posts from the post page. If
                    you see something that should be removed, or you think a removal was a mistake, use the contact details
                    below.
                </LegalSection>

                <LegalSection title="Your Data">
                    Signing in with Google gives the site your name, email address and profile picture. Your cloud saves,
                    the images on them, your posts and your comments are stored on the site&apos;s servers. The editor&apos;s
                    autosave, your local saves, custom keywords and saved colors stay in your browser and are never
                    uploaded. The{" "}
                    <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link> explains what is collected, which
                    providers are used, and how to ask for your data to be deleted.
                </LegalSection>

                <LegalSection title="Contact">
                    For questions, bug reports, status effect suggestions, moderation requests or data requests, email{" "}
                    <ContactEmailLink email={SITE_LINKS.contactEmail}/> or message{" "}
                    <span className="about-discord">{SITE_LINKS.discordHandle}</span> on Discord. The{" "}
                    <Link href="/contact" className="legal-link">Contact page</Link> lists the same details.
                </LegalSection>

                <LegalSection title="Disclaimer">
                    This is an unofficial fan project and is not affiliated with or endorsed by Project Moon.
                    All game-related assets and trademarks belong to their respective owners. For more information, see{" "}
                    <ExternalLink href={SITE_LINKS.fanContentPolicy}>Project Moon&apos;s Fan Content Policy</ExternalLink>.
                </LegalSection>

                <LegalSection title="Support">
                    If you enjoy the site and want to help keep it running, you can support it on{" "}
                    <ExternalLink href={SITE_LINKS.kofi}>Ko-fi</ExternalLink>
                    . Support goes toward hosting and image storage, and keeps every feature free for everyone.
                </LegalSection>
            </div>
        </div>
    );
}
