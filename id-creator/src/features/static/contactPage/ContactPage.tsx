import React from "react";
import ContactMethods from "components/contactMethods/ContactMethods";
import "./ContactPage.css";

export default function ContactPage() {
    return (
        <div className="page-container">
            <div className="page-content contact-page-content">
                <h1 className="page-title">Contact</h1>
                <ContactMethods classPrefix="contact"/>
            </div>
        </div>
    );
}
