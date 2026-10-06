import React, { ReactElement, ReactNode } from "react";
import { mailtoLink } from "config/siteLinks";

interface LegalSectionProps {
    title: string
    children: ReactNode
    items?: readonly string[]
}

export default function LegalSection({ title, children, items }: LegalSectionProps): ReactElement {
    return <div className="legal-section">
        <h2 className="legal-section-title">{title}</h2>
        <p className="legal-text">{children}</p>
        {items && <ul className="legal-list">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>}
    </div>
}

export const ExternalLink = ({ href, children }: { href: string, children: ReactNode }): ReactElement =>
    <a href={href} className="legal-link" target="_blank" rel="noreferrer">{children}</a>

export const ContactEmailLink = ({ email }: { email: string }): ReactElement =>
    <a href={mailtoLink(email)} className="legal-link">{email}</a>
