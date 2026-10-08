'use client'
import { ReactElement } from "react";
import "./LoginMenu.css"
import { GoogleOAuthProvider, NonOAuthError, useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import GoogleIcon from "assets/icons/GoogleIcon";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import BusyButton from "components/ui/busyButton/BusyButton";
import { useAddAlert } from "hooks/useAddAlert";
import { useLoginMenu } from "hooks/useLoginMenu";
import { useLoginWithGoogleMutation } from "api/AuthApi";
import getApiErrorMessage from "api/getApiErrorMessage";
import { clientEnv } from "config/env.client";
import { useAppSelector } from "stores/AppStore";
import { reportError } from "utils/reportError";

export const nonOAuthErrorMessage = (error: NonOAuthError): string =>
    error.type === "popup_closed" ? "Sign-in window was closed" : "Couldn't open the Google sign-in window"

function LoginMenuDialog(): ReactElement {
    const isLoginMenuActive = useAppSelector(state => state.ui.isLoginMenuActive)
    const { closeLoginMenu } = useLoginMenu()
    const { scriptLoadedSuccessfully } = useGoogleOAuth()
    const addAlert = useAddAlert()
    const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation()

    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async ({ code }) => {
            try {
                await loginWithGoogle(JSON.stringify(code)).unwrap()
                addAlert("Success", "Logged in")
                closeLoginMenu()
            } catch (error) {
                addAlert("Failure", getApiErrorMessage(error, "Login failed"))
            }
        },
        onError: (error) => {
            reportError(error, { context: "google-login" })
            addAlert("Failure", "Google sign-in failed")
        },
        onNonOAuthError: (error) => addAlert("Failure", nonOAuthErrorMessage(error)),
    })

    return <div className="login-menu-popup">
        <PopUpMenu open={isLoginMenuActive} label="Login" onClose={closeLoginMenu}>
            <div className="login-menu">
                <h1 className="login-menu-header">Login/Register</h1>
                <BusyButton busy={isLoading || !scriptLoadedSuccessfully} busyText={<>{isLoading ? "Logging in..." : "Loading Google..."}<GoogleIcon/></>}
                    onClick={() => login()} className="main-button center-element">
                    Login/Register with Google
                    <GoogleIcon/>
                </BusyButton>
            </div>
        </PopUpMenu>
    </div>
}

export default function LoginMenu(): ReactElement {
    return <GoogleOAuthProvider clientId={clientEnv.googleClientId}>
        <LoginMenuDialog/>
    </GoogleOAuthProvider>
}
