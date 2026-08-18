import { useEffect, useState } from "react";
import React from "react";
import "./LoginMenu.css"
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "Assets/Icons/GoogleIcon";
import PopUpMenu from "../PopUpMenu/PopUpMenu";
import useAlert from "Hooks/useAlert";
import { useRegisterMutation } from "Api/AuthApi";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { closeLoginMenu, toggleLoginMenu } from "Stores/Slices/UiSlice";

function LoginMenu(){
    const isLoginMenuActive = useAppSelector(state => state.ui.isLoginMenuActive)
    const dispatch = useAppDispatch()
    const [user,setUser] = useState<Omit<CodeResponse, "error" | "error_description" | "error_uri">>()
    const {addAlert} = useAlert();
    const [ register, {isLoading} ] = useRegisterMutation();


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
                        await register(JSON.stringify(user.code)).unwrap();
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

    return <div className={isLoginMenuActive?"login-menu-popup":"hidden"}>
        <PopUpMenu setIsActive={()=>dispatch(toggleLoginMenu())}>
            <div className="login-menu">
                <h1 className="login-menu-header">Login/Register</h1>
                {isLoading?
                <button className="main-button active center-element">
                    Logging in...
                    <GoogleIcon/>
                </button>:
                <button onClick={() => login()} className="main-button center-element">
                    Login/Register with Google
                    <GoogleIcon/>
                </button>}
            </div>
        </PopUpMenu>
    </div>
}

export { LoginMenu }
