import React from "react";
import { ReactElement } from "react";
import Link from "next/link";
import "./Footer.css";
import { SITE_LINKS } from "config/siteLinks";

export default function Footer(): ReactElement {
    return (
        <footer className="site-footer">
            <div className="site-footer-content">
                <nav className="footer-links">
                    <Link href="/" className="footer-link">Home</Link>
                    <Link href="/about" className="footer-link">About</Link>
                    <Link href="/blog" className="footer-link">Blog</Link>
                    <Link href="/contact" className="footer-link">Contact</Link>
                    <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
                    <Link href="/terms-of-service" className="footer-link">Terms of Service</Link>
                </nav>
                <div className="footer-disclaimer">
                    This is an unofficial fan work and is not endorsed by Project Moon.
                    <br />
                    For more information:{" "}
                    <a
                        href={SITE_LINKS.fanContentPolicy}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Project Moon&apos;s Fan Content Policy
                    </a>
                </div>
            </div>
        </footer>
    );
}
