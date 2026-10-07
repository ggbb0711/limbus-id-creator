import React from "react";
import ContactMethods from "components/contactMethods/ContactMethods";
import "./ErrorBoundary.css";

export default function ErrorFallback({ onRetry }: { onRetry?: () => void }) {
    return (
        <div className="error-boundary-container">
            <div className="error-boundary-content">
                <h1 className="error-boundary-title">Something went wrong</h1>
                <p className="error-boundary-message">
                    An unexpected error occurred. Please try refreshing the page. If the issue persists, contact me:
                </p>
                <ContactMethods classPrefix="error-boundary-contact"/>
                {onRetry && <button type="button" className="main-button" onClick={onRetry}>Try again</button>}
            </div>
        </div>
    );
}
