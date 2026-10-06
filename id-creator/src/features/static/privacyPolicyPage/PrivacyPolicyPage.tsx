import React from "react";
import { SITE_LINKS } from "config/siteLinks";
import LegalSection, { ContactEmailLink, ExternalLink } from "features/static/components/legalSection/LegalSection";

export default function PrivacyPolicyPage() {
    return (
        <div className="page-container">
            <div className="page-content legal-page-content">
                <h1 className="page-title">Privacy Policy</h1>
                <p className="legal-effective-date">Last updated: February 6, 2026</p>

                <LegalSection title="Information We Collect" items={[
                    "Account information provided through OAuth sign-in (such as your display name and profile picture)",
                    "User-generated content you create and share on the platform (cards, forum posts)",
                    "Cookies used for authentication and session management",
                    "Usage data collected through Google Analytics (pages visited, session duration, general location)",
                ]}>
                    When you use Limbus ID Creator, we may collect the following information:
                </LegalSection>

                <LegalSection title="Cookies">
                    We use httpOnly cookies to manage your authentication session. These cookies are essential for keeping
                    you signed in and cannot be accessed by client-side scripts, providing an additional layer of security.
                </LegalSection>

                <LegalSection title="Google Analytics">
                    We use Google Analytics to understand how visitors interact with our site. This service may collect
                    information such as your IP address, browser type, and pages visited. The data is aggregated and anonymized.
                    You can opt out of Google Analytics by installing the{" "}
                    <ExternalLink href="https://tools.google.com/dlpage/gaoptout">Google Analytics Opt-out Browser Add-on</ExternalLink>.
                </LegalSection>

                <LegalSection title="Third-Party Services">
                    We use third-party OAuth providers for authentication. When you sign in, we receive limited profile
                    information as authorized by the provider. We do not receive or store your password.
                </LegalSection>

                <LegalSection title="How We Use Your Information" items={[
                    "Provide and maintain the service",
                    "Authenticate your identity and manage your session",
                    "Display your user-generated content on the platform",
                    "Analyze usage patterns to improve the site",
                ]}>
                    We use the information we collect to:
                </LegalSection>

                <LegalSection title="Your Rights">
                    You may request to view, update, or delete your personal data at any time by contacting us.
                    You can also delete your account, which will remove your profile information from our system.
                </LegalSection>

                <LegalSection title="Monumetric advertisement">
                    *This Site is affiliated with Monumetric (dba for The Blogger Network, LLC) for the purposes of placing advertising on the Site, and Monumetric will collect and use certain data for advertising purposes. To learn more about Monumetric’s data usage, click here:{" "}
                    <ExternalLink href="http://www.monumetric.com/publisher-advertising-privacy">Publisher Advertising Privacy</ExternalLink>*
                </LegalSection>

                <LegalSection title="Contact">
                    If you have questions about this Privacy Policy, please contact us at{" "}
                    <ContactEmailLink email={SITE_LINKS.contactEmail}/>.
                </LegalSection>
            </div>
        </div>
    );
}
