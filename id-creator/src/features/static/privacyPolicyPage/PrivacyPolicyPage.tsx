import React from "react";
import Link from "next/link";
import { SITE_LINKS } from "config/siteLinks";
import LegalSection, { ContactEmailLink, ExternalLink } from "features/static/components/legalSection/LegalSection";

export default function PrivacyPolicyPage() {
    return (
        <div className="page-container">
            <div className="page-content legal-page-content">
                <h1 className="page-title">Privacy Policy</h1>
                <p className="legal-effective-date">Last updated: September 30, 2026</p>

                <p className="legal-text">
                    This Privacy Policy explains what information Limbus ID Creator (&quot;we&quot;, &quot;us&quot;) collects when you
                    use the site, how we use it, and the choices you have. By using the site you agree to this policy and to our{" "}
                    <Link href="/terms-of-service" className="legal-link">Terms of Service</Link>.
                </p>

                <div className="legal-section">
                    <h2 className="legal-section-title">Information We Collect</h2>
                    <p className="legal-text">We collect the following information:</p>
                    <ul className="legal-list">
                        <li><strong>Account information:</strong> when you sign in with Google, we receive your name, email address and profile picture. We never receive your Google password.</li>
                        <li><strong>Content you create:</strong> cloud saves of your cards, images you upload (such as splash art and icons), forum posts and comments. Posts and comments are public, together with your display name and profile picture.</li>
                        <li><strong>Activity on the site:</strong> when you open a post we record a view, linked to your account if you are signed in, to show view counts.</li>
                        <li><strong>Technical information:</strong> your IP address, browser, device type and the pages you visit, which are processed by our hosting, analytics, advertising and error monitoring providers.</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Cookies and Browser Storage</h2>
                    <ul className="legal-list">
                        <li><strong>Session cookie:</strong> an httpOnly cookie that keeps you signed in. It is essential for the site to work and cannot be read by scripts on the page.</li>
                        <li><strong>Analytics cookies:</strong> set by Google Analytics to measure how the site is used.</li>
                        <li><strong>Advertising cookies:</strong> set by our advertising partners and their vendors to show and measure ads (see Advertising below).</li>
                        <li><strong>Browser storage:</strong> the card editor stores your current card, your local saves, your custom keywords, your saved colors and layout preferences in your browser (IndexedDB and localStorage). This data stays on your device and is not sent to us unless you create a cloud save.</li>
                    </ul>
                    <p className="legal-text">
                        You can block or delete cookies and site data in your browser settings. Blocking the session cookie will
                        prevent you from signing in, and clearing site data will delete your local saves.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Advertising</h2>
                    <p className="legal-text">
                        *This Site is affiliated with Monumetric (dba for The Blogger Network, LLC) for the purposes of placing
                        advertising on the Site, and Monumetric will collect and use certain data for advertising purposes. To
                        learn more about Monumetric&apos;s data usage, click here:{" "}
                        <ExternalLink href="https://www.monumetric.com/publisher-advertising-privacy">Publisher Advertising Privacy</ExternalLink>*
                    </p>
                    <p className="legal-text">
                        Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website
                        or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you
                        based on your visits to this site and/or other sites on the Internet.
                    </p>
                    <p className="legal-text">
                        You may opt out of personalized advertising by visiting{" "}
                        <ExternalLink href="https://adssettings.google.com">Google Ads Settings</ExternalLink>. You can also opt out
                        of some third-party vendors&apos; use of cookies for personalized advertising at{" "}
                        <ExternalLink href="https://www.aboutads.info/choices">www.aboutads.info</ExternalLink>. Where the law
                        requires it, such as in the European Economic Area, the United Kingdom and Switzerland, we ask for your
                        consent before personalized ads are shown.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Analytics and Error Monitoring</h2>
                    <p className="legal-text">
                        We use Google Analytics to understand how visitors use the site, such as which pages are visited and for how
                        long. You can opt out by installing the{" "}
                        <ExternalLink href="https://tools.google.com/dlpage/gaoptout">Google Analytics Opt-out Browser Add-on</ExternalLink>.
                    </p>
                    <p className="legal-text">
                        We use Sentry to detect and fix errors. When something goes wrong, an error report is sent that can include
                        your browser, device, the page you were on and technical details of the error.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">How We Use Your Information</h2>
                    <ul className="legal-list">
                        <li>Provide the card editor, cloud saves, the forum and your profile</li>
                        <li>Sign you in and keep your session secure</li>
                        <li>Display the posts, comments and profile information you choose to share</li>
                        <li>Understand how the site is used and fix problems</li>
                        <li>Show advertising that helps keep the site free</li>
                        <li>Enforce our Terms of Service and respond to your requests</li>
                    </ul>
                    <p className="legal-text">We do not sell your personal information.</p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Service Providers</h2>
                    <p className="legal-text">We share information only with the providers that help us run the site:</p>
                    <ul className="legal-list">
                        <li>Netlify: website hosting</li>
                        <li>Amazon Web Services: storage of uploaded images</li>
                        <li>Google: sign-in, analytics and advertising</li>
                        <li>Monumetric and its advertising partners: advertising</li>
                        <li>Sentry: error monitoring</li>
                    </ul>
                    <p className="legal-text">
                        We may also disclose information if required by law or to protect the rights and safety of our users and the site.
                    </p>
                </div>

                <LegalSection title="Data Retention">
                    We keep your account information and content until you ask us to delete it or your account is removed for
                    breaking our Terms of Service. Analytics, advertising and error data are kept according to each
                    provider&apos;s own retention settings.
                </LegalSection>

                <div className="legal-section">
                    <h2 className="legal-section-title">Your Rights</h2>
                    <p className="legal-text">
                        You can ask to access, correct or delete your personal information by emailing{" "}
                        <ContactEmailLink email={SITE_LINKS.contactEmail}/> from the email
                        address linked to your account. Deleting your account removes your profile, posts, comments and cloud saves.
                        We will respond within 30 days.
                    </p>
                    <p className="legal-text">
                        Depending on where you live, such as in the European Union, the United Kingdom or California, you may have
                        additional rights, including the right to object to or restrict processing, to data portability, and to
                        complain to your local data protection authority.
                    </p>
                </div>

                <LegalSection title="Children">
                    The site is not directed at children under 13, and you must be at least 13 years old to create an account.
                    If we learn that a child under 13 has created an account, we will delete it. If you believe this has
                    happened, please contact us.
                </LegalSection>

                <LegalSection title="Security">
                    We use HTTPS, httpOnly session cookies and access controls to protect your information. No method of
                    transmission or storage is completely secure, so we cannot guarantee absolute security.
                </LegalSection>

                <LegalSection title="International Users">
                    Our service providers may process your information in countries other than the one you live in, including
                    the United States. By using the site, you understand that your information may be transferred to those countries.
                </LegalSection>

                <LegalSection title="Changes to This Policy">
                    We may update this policy from time to time. The date at the top of this page shows when it was last
                    changed. Continuing to use the site after an update means you accept the updated policy.
                </LegalSection>

                <LegalSection title="Contact">
                    If you have questions about this Privacy Policy, please contact us at{" "}
                    <ContactEmailLink email={SITE_LINKS.contactEmail}/>.
                </LegalSection>
            </div>
        </div>
    );
}
