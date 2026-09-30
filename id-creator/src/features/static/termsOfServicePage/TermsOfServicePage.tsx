import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <div className="page-container">
            <div className="page-content legal-page-content">
                <h1 className="page-title">Terms of Service</h1>
                <p className="legal-effective-date">Last updated: September 30, 2026</p>

                <div className="legal-section">
                    <h2 className="legal-section-title">Acceptance of Terms</h2>
                    <p className="legal-text">
                        By accessing or using Limbus ID Creator, you agree to be bound by these Terms of Service and our{" "}
                        <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link>.
                        If you do not agree to these terms, please do not use the service.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Eligibility</h2>
                    <p className="legal-text">
                        You must be at least 13 years old to create an account or post on the site. If you are under the age of
                        majority where you live, you may only use the site with the permission of a parent or guardian.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Fan-Made Project Disclaimer</h2>
                    <p className="legal-text">
                        Limbus ID Creator is an unofficial fan-made project and is not affiliated with, endorsed by, or
                        connected to Project Moon in any way. All game-related assets, names, and trademarks belong to their
                        respective owners. This project operates in accordance with{" "}
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
                    <h2 className="legal-section-title">Accounts</h2>
                    <p className="legal-text">
                        You sign in with your Google account. You are responsible for all activity on your account and for keeping
                        access to your Google account secure. To delete your account, email us from the address linked to it.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">User-Generated Content</h2>
                    <p className="legal-text">
                        You retain ownership of the original content you create using our tools. By saving content to the cloud or
                        sharing it on the site, you grant us a non-exclusive, worldwide, royalty-free license to host, store,
                        display, and create previews and thumbnails of it in order to run the site. This license ends when you
                        delete the content or your account, except for copies that others have already shared or that we must
                        keep by law.
                    </p>
                    <p className="legal-text">
                        You are responsible for the content you upload. You confirm that you created any images you upload or
                        have permission to use them, and you should credit the original artist when you share someone else&apos;s work.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Acceptable Use</h2>
                    <p className="legal-text">You agree not to:</p>
                    <ul className="legal-list">
                        <li>Use the service for any unlawful purpose</li>
                        <li>Upload content that is offensive, harmful, sexually explicit, or infringes on intellectual property rights</li>
                        <li>Harass, threaten, or abuse other users</li>
                        <li>Attempt to disrupt or interfere with the service&apos;s operation</li>
                        <li>Impersonate other users or misrepresent your identity</li>
                        <li>Use automated tools to scrape or abuse the service</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Content Removal</h2>
                    <p className="legal-text">
                        We may remove or hide any content that we believe breaks these terms, infringes someone else&apos;s
                        rights, or harms the community, with or without notice.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Copyright Complaints</h2>
                    <p className="legal-text">
                        If you believe content on the site infringes your copyright, email{" "}
                        <a href="mailto:johnidmaker@gmail.com" className="legal-link">johnidmaker@gmail.com</a> with a description
                        of your work, the link to the content on our site, and your contact details. We will review the request
                        and remove infringing content.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Intellectual Property</h2>
                    <p className="legal-text">
                        The site&apos;s original code, design, and non-game-related content are the property of Limbus ID Creator.
                        Game-related assets remain the property of Project Moon and their respective owners.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Third-Party Services</h2>
                    <p className="legal-text">
                        The site uses third-party services such as Google sign-in and displays advertising from third parties. It may
                        also link to other websites. These services and websites are governed by their own terms and privacy policies,
                        and we are not responsible for them.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Account Termination</h2>
                    <p className="legal-text">
                        We reserve the right to suspend or terminate accounts that violate these terms or engage in behavior
                        that is harmful to the community or the service.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Limitation of Liability</h2>
                    <p className="legal-text">
                        Limbus ID Creator is provided &quot;as is&quot; without warranties of any kind. To the fullest extent
                        permitted by law, we are not liable for any damages arising from your use of the service, including but
                        not limited to loss of data or interruption of service. Keep your own copies of cards you care about.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Changes to Terms</h2>
                    <p className="legal-text">
                        We may update these Terms of Service from time to time. The date at the top of this page shows when they
                        were last changed. Continued use of the service after changes are posted constitutes acceptance of the
                        updated terms.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Contact</h2>
                    <p className="legal-text">
                        If you have questions about these Terms of Service, please contact us at{" "}
                        <a href="mailto:johnidmaker@gmail.com" className="legal-link">johnidmaker@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
