'use client'
import React, { ReactElement, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { reportError } from "utils/reportError";
import "./ErrorBoundary.css";

interface SectionErrorBoundaryProps {
    context: string
    label: string
    children: ReactNode
}

export default function SectionErrorBoundary({ context, label, children }: SectionErrorBoundaryProps): ReactElement {
    return <ErrorBoundary
        onError={(error, info) => reportError(error, { context: `boundary:${context}`, extra: { componentStack: info.componentStack } })}
        fallbackRender={({ resetErrorBoundary }) =>
            <div className="section-error" role="alert">
                <p>The {label} couldn&apos;t be displayed.</p>
                <button type="button" className="main-button" onClick={resetErrorBoundary}>Try again</button>
            </div>
        }>
        {children}
    </ErrorBoundary>
}
