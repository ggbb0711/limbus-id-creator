'use client'
import React, { ReactNode } from "react";
import StoreProvider from "stores/StoreProvider";
import LoginMenuHost from "components/loginMenu/LoginMenuHost";
import AlertPopUp from "components/alertPopUp/AlertPopUp";
import AuthBootstrap from "components/authBootstrap/AuthBootstrap";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <StoreProvider>
            <AuthBootstrap />
            <LoginMenuHost />
            {children}
            <AlertPopUp />
        </StoreProvider>
    )
}
