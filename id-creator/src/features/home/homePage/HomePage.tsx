import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import "./HomePage.css"
import { IPostDisplayCard, PostDisplayCard } from "features/post";
import siteLogo from "assets/images/SiteLogo.webp";
import { SITE_LINKS } from "config/siteLinks";
import { NAV_LINKS } from "config/navLinks";

const editorTips: { title: string, text: ReactNode, href: string }[] = [
    {
        title: "Type [ for keywords",
        text: <>Type <code>[burn]</code>, <code>[clash_win]</code> or <code>[coin_1]</code> in any description to insert the in-game keyword with its icon. Typing <code>]</code> autocompletes an exact match.</>,
        href: "/blog/card-creator-guide#keywords-with-square-brackets",
    },
    {
        title: "Special coins",
        text: <>Add <code>[coin_2_unbreakable]</code> or <code>[coin_3_excision]</code> to a skill and that coin&apos;s icon changes on the card.</>,
        href: "/blog/card-creator-guide#special-coins",
    },
    {
        title: "Custom effects",
        text: <>Name a custom effect and it becomes its own <code>[keyword]</code> with your icon and color, or a custom coin type.</>,
        href: "/blog/card-creator-guide#custom-effect",
    },
    {
        title: "Custom keywords",
        text: <>Save up to 20 colored keywords in your browser for terms you use across cards.</>,
        href: "/blog/card-creator-guide#custom-keywords",
    },
    {
        title: "Autosave, local and cloud saves",
        text: <>Your card survives a refresh. Local saves stay in this browser, while cloud saves follow you to any device and can be attached to posts.</>,
        href: "/blog/card-creator-guide#saving-your-work",
    },
    {
        title: "Share on the forum",
        text: <>Attach your cloud saves to a post and add a description to get feedback from other players.</>,
        href: "/blog/how-to-post-your-creation",
    },
]

export default function HomePage({ latestPosts }: { latestPosts: IPostDisplayCard[] | null }){
    return <div className="page-container home-page-container">
        <div className="page-content home-page-content">
            <Image src={siteLogo} alt="Limbus ID Creator logo" className="hero-site-logo" sizes="(max-width: 900px) 100vw, 850px" preload/>
            <h1 className="home-page-hero-text">Hello, welcome to the Limbus ID creator. A fan project for those who want to create custom characters from the game <a href={SITE_LINKS.limbusCompany} className="home-page-link" target="_blank" rel="noreferrer">Limbus Company</a></h1>
            <div className="action-button-container">
                {NAV_LINKS.map(link => <Link key={link.href} href={link.href} className="main-button nav-button">{link.label}</Link>)}
            </div>
        </div>
        <div className="page-content latest-posts-section">
            <div className="latest-posts-header">
                <h2 className="page-title">Latest Posts</h2>
                <Link href="/forum" className="latest-posts-view-all">View all</Link>
            </div>
            <div className="post-display-list">
                {latestPosts === null ?
                    <p className="latest-posts-empty" role="alert">Latest posts are unavailable right now. Please try again later.</p>
                    : latestPosts.length > 0 ?
                    latestPosts.map((post)=><PostDisplayCard key={post.id} {...post}/>)
                    :
                    <p className="latest-posts-empty">No posts yet. Be the first to share your creation!</p>
                }
            </div>
        </div>
        <div className="page-content legal-page-content home-page-section">
            <h2 className="page-title">What you can make</h2>
            <div className="home-feature-grid">
                <div className="home-feature-card">
                    <h3 className="legal-section-title"><Link href="/creator/identity" className="home-feature-link">Identity and E.G.O</Link></h3>
                    <p className="legal-text">Have an idea for an OC but don&apos;t know how to use canva or figma to design edit. Don&apos;t worry we can help you to create identities and E.G.O based on the format of the game, with custom keywords and more!</p>
                </div>
                <div className="home-feature-card">
                    <h3 className="legal-section-title"><Link href="/forum" className="home-feature-link">Community forum</Link></h3>
                    <p className="legal-text">Share your creations, explain the concept behind them, and get feedback from other players. Filter posts by Sinner or status effect to find kits like yours.</p>
                </div>
            </div>
        </div>
        <div className="page-content legal-page-content home-page-section">
            <div className="latest-posts-header">
                <h2 className="page-title">Editor tips</h2>
                <Link href="/blog" className="latest-posts-view-all">View all guides</Link>
            </div>
            <div className="home-feature-grid">
                {editorTips.map((tip) => <div key={tip.title} className="home-feature-card">
                    <h3 className="legal-section-title">{tip.title}</h3>
                    <p className="legal-text">{tip.text}</p>
                    <Link href={tip.href} className="home-tip-link">Learn more</Link>
                </div>)}
            </div>
        </div>
    </div>
}
