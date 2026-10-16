import React, { ReactElement } from "react";
import Link from "next/link";
import ContactMethods from "components/contactMethods/ContactMethods";
import { getUnavailableContent } from "./unavailableContent";
import "./UnavailablePage.css"

export default function UnavailablePage({ code }: { code: string }): ReactElement {
    const { title, message } = getUnavailableContent(code)
    return <div className="page-container unavailable-page-container">
        <div className="page-content unavailable-page-content">
            <h1 className="unavailable-page-title">{title}</h1>
            <p className="unavailable-page-message">{message}</p>
            <ContactMethods classPrefix="unavailable-page-contact"/>
            <div>
                <Link href="/forum" className="main-button nav-button">Back to forum</Link>
            </div>
        </div>
    </div>
}
