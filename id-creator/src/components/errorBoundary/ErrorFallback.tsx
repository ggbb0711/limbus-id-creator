import React from "react";
import DiscordIcon from "assets/icons/DiscordIcon";
import "./ErrorBoundary.css";

export default function ErrorFallback({ onRetry }: { onRetry?: () => void }) {
    return (
        <div className="error-boundary-container">
            <div className="error-boundary-content">
                <h1 className="error-boundary-title">Something went wrong</h1>
                <p className="error-boundary-message">
                    An unexpected error occurred. Please try refreshing the page. If the issue persists, contact me:
                </p>
                <div className="error-boundary-contact-methods">
                    <div className="error-boundary-contact-method">
                        <span className="error-boundary-contact-method-icon">✉</span>
                        <a href="mailto:johnidmaker@gmail.com">johnidmaker@gmail.com</a>
                    </div>
                    <div className="error-boundary-contact-method">
                        <span className="error-boundary-contact-method-icon">
                            <DiscordIcon />
                        </span>
                        <span>_johnlimbusmaker</span>
                    </div>
                </div>
                {onRetry && <button className="main-button" onClick={onRetry}>Try again</button>}
            </div>
        </div>
    );
}
