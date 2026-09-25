import React from "react";
import DiscordIcon from "assets/icons/DiscordIcon";
import "./ContactPage.css";

export default function ContactPage() {
    return (
        <div className="page-container">
            <div className="page-content contact-page-content">
                <h1 className="page-title">Contact</h1>
                <div className="contact-methods">
                    <div className="contact-method">
                        <span className="contact-method-icon">✉</span>
                        <a href="mailto:johnidmaker@gmail.com">johnidmaker@gmail.com</a>
                    </div>
                    <div className="contact-method">
                        <span className="contact-method-icon">
                            <DiscordIcon />
                        </span>
                        <span>_johnlimbusmaker</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
