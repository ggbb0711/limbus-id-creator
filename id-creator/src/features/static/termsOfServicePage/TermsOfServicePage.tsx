
export default function TermsOfServicePage() {
    return (
        <div className="page-container">
            <div className="page-content legal-page-content">
                <h1 className="page-title">Terms of Service</h1>
                <p className="legal-effective-date">Last updated: February 6, 2026</p>

                <div className="legal-section">
                    <h2 className="legal-section-title">Acceptance of Terms</h2>
                    <p className="legal-text">
                        By accessing or using Limbus ID Creator, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use the service.
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
                    <h2 className="legal-section-title">User-Generated Content</h2>
                    <p className="legal-text">
                        You retain ownership of the original content you create using our tools. By sharing content on the
                        platform, you grant us a non-exclusive license to display it on the site. You are responsible for
                        ensuring your content does not infringe on the rights of others.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Acceptable Use</h2>
                    <p className="legal-text">You agree not to:</p>
                    <ul className="legal-list">
                        <li>Use the service for any unlawful purpose</li>
                        <li>Upload content that is offensive, harmful, or infringes on intellectual property rights</li>
                        <li>Attempt to disrupt or interfere with the service&apos;s operation</li>
                        <li>Impersonate other users or misrepresent your identity</li>
                        <li>Use automated tools to scrape or abuse the service</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Intellectual Property</h2>
                    <p className="legal-text">
                        The site&apos;s original code, design, and non-game-related content are the property of Limbus ID Creator.
                        Game-related assets remain the property of Project Moon and their respective owners.
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
                        Limbus ID Creator is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
                        damages arising from your use of the service, including but not limited to loss of data or
                        interruption of service.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Changes to Terms</h2>
                    <p className="legal-text">
                        We may update these Terms of Service from time to time. Continued use of the service after changes
                        are posted constitutes acceptance of the updated terms.
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
