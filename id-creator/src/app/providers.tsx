'use client'
import React, { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import StoreProvider from "stores/StoreProvider";
import { LoginMenu } from "components/loginMenu/LoginMenu";
import AlertPopUp from "components/alertPopUp/AlertPopUp";
import AuthBootstrap from "components/authBootstrap/AuthBootstrap";
import { clientEnv } from "config/env.client";

// Providers needed on every route. Creator-only providers (drag and drop, card ref) live in app/creator/layout.tsx.
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <StoreProvider>
            <GoogleOAuthProvider clientId={clientEnv.googleClientId}>
                <AuthBootstrap />
                <LoginMenu />
                {children}
                <AlertPopUp />
            </GoogleOAuthProvider>
        </StoreProvider>
    )
}
