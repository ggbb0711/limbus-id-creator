import React from "react";
import { SITE_LINKS } from "config/siteLinks";
import LegalSection, { ContactEmailLink, ExternalLink } from "features/static/components/legalSection/LegalSection";

export default function TermsOfServicePage() {
    return (
        <div className="page-container">
            <div className="page-content legal-page-content">
                <h1 className="page-title">Terms of Service</h1>
                <p className="legal-effective-date">Last updated: February 6, 2026</p>

                <LegalSection title="Acceptance of Terms">
                    By accessing or using Limbus ID Creator, you agree to be bound by these Terms of Service.
                    If you do not agree to these terms, please do not use the service.
                </LegalSection>

                <LegalSection title="Fan-Made Project Disclaimer">
                    Limbus ID Creator is an unofficial fan-made project and is not affiliated with, endorsed by, or
                    connected to Project Moon in any way. All game-related assets, names, and trademarks belong to their
                    respective owners. This project operates in accordance with{" "}
                    <ExternalLink href={SITE_LINKS.fanContentPolicy}>Project Moon&apos;s Fan Content Policy</ExternalLink>.
                </LegalSection>

                <LegalSection title="User-Generated Content">
                    You retain ownership of the original content you create using our tools. By sharing content on the
                    platform, you grant us a non-exclusive license to display it on the site. You are responsible for
                    ensuring your content does not infringe on the rights of others.
                </LegalSection>

                <LegalSection title="Acceptable Use" items={[
                    "Use the service for any unlawful purpose",
                    "Upload content that is offensive, harmful, or infringes on intellectual property rights",
                    "Attempt to disrupt or interfere with the service's operation",
                    "Impersonate other users or misrepresent your identity",
                    "Use automated tools to scrape or abuse the service",
                ]}>
                    You agree not to:
                </LegalSection>

                <LegalSection title="Intellectual Property">
                    The site&apos;s original code, design, and non-game-related content are the property of Limbus ID Creator.
                    Game-related assets remain the property of Project Moon and their respective owners.
                </LegalSection>

                <LegalSection title="Account Termination">
                    We reserve the right to suspend or terminate accounts that violate these terms or engage in behavior
                    that is harmful to the community or the service.
                </LegalSection>

                <LegalSection title="Limitation of Liability">
                    Limbus ID Creator is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
                    damages arising from your use of the service, including but not limited to loss of data or
                    interruption of service.
                </LegalSection>

                <LegalSection title="Changes to Terms">
                    We may update these Terms of Service from time to time. Continued use of the service after changes
                    are posted constitutes acceptance of the updated terms.
                </LegalSection>

                <LegalSection title="Contact">
                    If you have questions about these Terms of Service, please contact us at{" "}
                    <ContactEmailLink email={SITE_LINKS.contactEmail}/>.
                </LegalSection>
            </div>
        </div>
    );
}
