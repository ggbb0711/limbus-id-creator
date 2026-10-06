import { useEffect, useState } from "react";
import React from "react";
import "./LoginMenu.css"
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "assets/icons/GoogleIcon";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import { useAddAlert } from "hooks/useAddAlert";
import { useLoginWithGoogleMutation } from "api/AuthApi";
import { useAppSelector, useAppDispatch } from "stores/AppStore";
import { closeLoginMenu } from "stores/slices/UiSlice";
import BusyButton from "components/ui/busyButton/BusyButton";

function LoginMenu(){
    const isLoginMenuActive = useAppSelector(state => state.ui.isLoginMenuActive)
    const dispatch = useAppDispatch()
    const [user,setUser] = useState<Omit<CodeResponse, "error" | "error_description" | "error_uri">>()
    const addAlert = useAddAlert()
    const [ loginWithGoogle, {isLoading} ] = useLoginWithGoogleMutation();


    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: (codeRes)=>{
            setUser(codeRes)
        },
        onError:(error)=>console.log("Error: "+error),
    })


    useEffect(
        () => {
            const registerUser = async ()=>{
                if (user) {
                    try{
                        await loginWithGoogle(JSON.stringify(user.code)).unwrap();
                        addAlert("Success","Login successfully");
                        dispatch(closeLoginMenu());
                    }
                    catch(err){
                        console.log(err);
                        addAlert("Failure","Login failed");
                    }
                }
            }
            registerUser();
        },
        [ user ]
    );

    return <div className="login-menu-popup">
        <PopUpMenu open={isLoginMenuActive} label="Login" onClose={()=>dispatch(closeLoginMenu())}>
            <div className="login-menu">
                <h1 className="login-menu-header">Login/Register</h1>
                <BusyButton busy={isLoading} busyText={<>Logging in...<GoogleIcon/></>} onClick={() => login()} className="main-button center-element">
                    Login/Register with Google
                    <GoogleIcon/>
                </BusyButton>
            </div>
        </PopUpMenu>
    </div>
}

export { LoginMenu }
