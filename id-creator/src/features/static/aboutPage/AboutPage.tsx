import React from "react";
import Link from "next/link";
import "./AboutPage.css";

export default function AboutPage() {
    return (
        <div className="page-container">
            <div className="page-content about-page-content legal-page-content">
                <h1 className="page-title">About</h1>
                <p className="about-intro">
                    Limbus ID Creator is a fan-made tool for the community of{" "}
                    <a href="https://limbuscompany.com/" className="legal-link" target="_blank" rel="noreferrer">
                        Limbus Company
                    </a>
                    . It allows you to design and share custom Identity and E.G.O cards inspired by the game.
                </p>

                <div className="legal-section">
                    <h2 className="legal-section-title">Creator Tools</h2>
                    <p className="legal-text">
                        Use our{" "}
                        <Link href="/creator/identity" className="legal-link">Identity Creator</Link>
                        {" "}to design custom Identity cards, or the{" "}
                        <Link href="/creator/ego" className="legal-link">E.G.O Creator</Link>
                        {" "}to craft your own E.G.O cards. Customize artwork, stats, skills, and more.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Community</h2>
                    <p className="legal-text">
                        Share your creations and discuss ideas with others on our{" "}
                        <Link href="/forum" className="legal-link">Forum</Link>
                        . Browse what the community has made and get inspired for your next creation.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Disclaimer</h2>
                    <p className="legal-text">
                        This is an unofficial fan project and is not affiliated with or endorsed by Project Moon.
                        All game-related assets and trademarks belong to their respective owners. For more information, see{" "}
                        <a
                            href="https://x.com/ProjMoonStudio/status/1629085462236397573?lang=en"
                            className="legal-link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Project Moon&apos;s Fan Content Policy
                        </a>.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Support</h2>
                    <p className="legal-text">
                        If you enjoy this project and want to support its development, consider buying us a coffee on{" "}
                        <a href="https://ko-fi.com/" className="legal-link" target="_blank" rel="noreferrer">
                            Ko-fi
                        </a>
                        . Your support helps keep this project running and free for everyone.
                    </p>
                </div>
            </div>
        </div>
    );
}
