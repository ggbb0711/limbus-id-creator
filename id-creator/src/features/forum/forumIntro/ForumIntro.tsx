import React, { ReactElement } from "react";
import Link from "next/link";

const featuredTags: { key: string, label: string }[] = [
    { key: "Identity", label: "Identities" },
    { key: "Ego", label: "E.G.Os" },
    { key: "Burn", label: "Burn" },
    { key: "Bleed", label: "Bleed" },
    { key: "Tremor", label: "Tremor" },
    { key: "Rupture", label: "Rupture" },
    { key: "Sinking", label: "Sinking" },
    { key: "Poise", label: "Poise" },
    { key: "Charge", label: "Charge" },
]

export default function ForumIntro(): ReactElement {
    return <div className="page-container">
        <div className="page-content legal-page-content forum-intro">
            <h1 className="page-title">Community Forum</h1>
            <p className="legal-text">
                Browse custom Limbus Company Identities and E.G.Os designed by other players. Each post includes the
                card itself and the creator&apos;s notes on the concept and how the kit is meant to play. Search by
                title, filter by Sinner or status effect, and leave a comment with feedback. To share your own, build
                a card in the <Link href="/creator/identity" className="legal-link">Identity Creator</Link> or{" "}
                <Link href="/creator/ego" className="legal-link">E.G.O Creator</Link>, make a cloud save, and create a
                new post. New to card design? Start with the <Link href="/blog/card-creator-guide" className="legal-link">Card Creator Guide</Link>.
            </p>
            <p className="legal-text">
                Popular filters:{" "}
                {featuredTags.map((tag, i) => <React.Fragment key={tag.key}>
                    {i > 0 && ", "}
                    <Link href={`/forum?tag=${tag.key}`} className="legal-link">{tag.label}</Link>
                </React.Fragment>)}
            </p>
        </div>
    </div>
}
