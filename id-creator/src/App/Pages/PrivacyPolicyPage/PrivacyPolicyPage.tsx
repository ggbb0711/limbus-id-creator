import React from "react";
import "../Shared/Styles/PageLayout.css";
import "./PrivacyPolicyPage.css";

export default function PrivacyPolicyPage() {
    return (
        <div className="page-container">
            <div className="page-content legal-page-content">
                <h1 className="page-title">Privacy Policy</h1>
                <p className="legal-effective-date">Last updated: February 6, 2026</p>

                <div className="legal-section">
                    <h2 className="legal-section-title">Information We Collect</h2>
                    <p className="legal-text">When you use Limbus ID Creator, we may collect the following information:</p>
                    <ul className="legal-list">
                        <li>Account information provided through OAuth sign-in (such as your display name and profile picture)</li>
                        <li>User-generated content you create and share on the platform (cards, forum posts)</li>
                        <li>Cookies used for authentication and session management</li>
                        <li>Usage data collected through Google Analytics (pages visited, session duration, general location)</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Cookies</h2>
                    <p className="legal-text">
                        We use httpOnly cookies to manage your authentication session. These cookies are essential for keeping
                        you signed in and cannot be accessed by client-side scripts, providing an additional layer of security.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Google Analytics</h2>
                    <p className="legal-text">
                        We use Google Analytics to understand how visitors interact with our site. This service may collect
                        information such as your IP address, browser type, and pages visited. The data is aggregated and anonymized.
                        You can opt out of Google Analytics by installing the{" "}
                        <a
                            href="https://tools.google.com/dlpage/gaoptout"
                            className="legal-link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Google Analytics Opt-out Browser Add-on
                        </a>.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Third-Party Services</h2>
                    <p className="legal-text">
                        We use third-party OAuth providers for authentication. When you sign in, we receive limited profile
                        information as authorized by the provider. We do not receive or store your password.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">How We Use Your Information</h2>
                    <p className="legal-text">We use the information we collect to:</p>
                    <ul className="legal-list">
                        <li>Provide and maintain the service</li>
                        <li>Authenticate your identity and manage your session</li>
                        <li>Display your user-generated content on the platform</li>
                        <li>Analyze usage patterns to improve the site</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Your Rights</h2>
                    <p className="legal-text">
                        You may request to view, update, or delete your personal data at any time by contacting us.
                        You can also delete your account, which will remove your profile information from our system.
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Monumetric advertisement</h2>
                    <p className="legal-text">
                        *This Site is affiliated with Monumetric (dba for The Blogger Network, LLC) for the purposes of placing advertising on the Site, and Monumetric will collect and use certain data for advertising purposes. To learn more about Monumetric’s data usage, click here: 
                        <a target="_blank" rel="noreferrer" href="http://www.monumetric.com/publisher-advertising-privacy">Publisher Advertising Privacy</a>*
                    </p>
                </div>

                <div className="legal-section">
                    <h2 className="legal-section-title">Contact</h2>
                    <p className="legal-text">
                        If you have questions about this Privacy Policy, please contact us at{" "}
                        <a href="mailto:johnidmaker@gmail.com" className="legal-link">johnidmaker@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
