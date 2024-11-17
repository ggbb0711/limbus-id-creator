import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import "./LoginMenu.css"
import MainButton from "utils/MainButton/MainButton";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import PopUpMenu from "utils/PopUpMenu/PopUpMenu";
import { useAlertContext } from "component/context/AlertContext";
import { useLoginUserContext } from "component/context/LoginUserContext";
import IResponse from "Interfaces/IResponse";
import ILoginUser from "Interfaces/ILoginUser";
import Google_icon from "Icons/Google_icon";

const loginMenuContext = createContext(null)

function LoginMenu({children}){
    const [isLoginMenuActive,setIsLoginMenuActive] = useState(false)
    const [isLoggingIn,setIsLogginIn] = useState(false)
    const [user,setUser] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>()
    const {addAlert} = useAlertContext()
    const {setLoginUser} = useLoginUserContext()


    const login = useGoogleLogin({
        onSuccess: (codeRes)=>{
            setUser(codeRes)
        },
        onError:(error)=>console.log("Error: "+error),
    })


    useEffect(
        () => {
            if (user) {
                setIsLogginIn(true)
                fetch(`${process.env.REACT_APP_SERVER_URL}/API/OAuth/oauth2/register`, {
                        method: "POST",
                        credentials: "include",
                        headers:{
                            "Content-type":"application/json"
                        },
                        body:JSON.stringify(user.access_token)
                    })
                    .then(res=>res.json())
                    .then((res:IResponse<ILoginUser>) => {
                        if(res.response){
                            setLoginUser(res.response)
                            setIsLoginMenuActive(false)
                            addAlert("Success","Login successfully")
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        addAlert("Failure","Login failed")
                    })
                    .finally(()=>setIsLogginIn(false))
            }
        },
        [ user ]
    );

    return <loginMenuContext.Provider value={{isLoginMenuActive,setIsLoginMenuActive}}>
        <div className={isLoginMenuActive?"login-menu-popup":"hidden"}>
            <PopUpMenu setIsActive={()=>setIsLoginMenuActive(!isLoginMenuActive)}>
                <div className="login-menu">
                    <h1 className="login-menu-header">Login/Register</h1>
                    {isLoggingIn?
                    <MainButton component={<>
                        Logging in...
                        <Google_icon/>
                    </>} btnClass="main-button active center-element"/>:
                    <MainButton clickHandler={() => login()} component={<>
                        Login/Register with Google
                        <Google_icon/>
                    </>} btnClass={"main-button center-element"}/>}
                </div>
            </PopUpMenu>
        </div>
        {children}

    </loginMenuContext.Provider>
}

const useLoginMenuContext = ()=>useContext(loginMenuContext)

export {LoginMenu,useLoginMenuContext}