import ILoginUser from "Interfaces/ILoginUser";
import IResponse from "Interfaces/IResponse";
import React, { Children, createContext, ReactElement, useContext, useEffect, useState } from "react";


const loginContext = createContext(null)

const LoginUserContextProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [loginUser,setLoginUser]= useState<ILoginUser>(null)

    function logOut(){
        setLoginUser(null)
    }
    
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_URL}/API/OAuth/oauth2/login`, {
            method: "POST",
            credentials: "include",})
            .then((res)=>res.json())
            .then((res:IResponse<ILoginUser>)=>{
                setLoginUser(res.response)
            })
            .catch((err)=>console.log(err))
    },[])

    return <loginContext.Provider value={{loginUser,setLoginUser,logOut}}>
        {children}
    </loginContext.Provider>
}

const useLoginUserContext =()=> useContext(loginContext)

export {useLoginUserContext,LoginUserContextProvider}