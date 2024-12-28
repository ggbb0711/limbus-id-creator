import React, { useState } from "react";
import { ReactElement } from "react";
import {Link, Outlet} from "react-router-dom";
import "./HeaderLayout.css"
import MainButton from "utils/MainButton/MainButton";
import { RefDownloadProvider } from "component/context/ImgUrlContext";
import SideBar from "./SideBar/SideBar";
import { AlertContextProvider } from "component/context/AlertContext";
import AlertPopUp from "./AlertPopUp/AlertPopUp";
import { LoginMenu, useLoginMenuContext } from "component/util/LoginMenu/LoginMenu";
import { LoginUserContextProvider, useLoginUserContext } from "component/context/LoginUserContext";
import { SettingMenu } from "../SettingMenu/SettingMenu";
import Kofi_icon from "Icons/Kofi_icon";

export default function HeaderLayout():ReactElement{

    return <LoginUserContextProvider>
        <AlertContextProvider>
            <RefDownloadProvider>
                <LoginMenu>
                    <SettingMenu>
                        <HeaderLayoutContent/>
                    </SettingMenu>
                </LoginMenu>
            </RefDownloadProvider>
        </AlertContextProvider>
    </LoginUserContextProvider> 
}


function HeaderLayoutContent():ReactElement{
    const [isSideBarActive,setActiveSideBar] = useState(false)
    const {isLoginMenuActive,setIsLoginMenuActive} = useLoginMenuContext()
    const {loginUser} = useLoginUserContext()

    return <div className="site-layout">
            <nav className="site-header">
                <div className="hamburger-icon-container" onClick={()=>setActiveSideBar(!isSideBarActive)}>
                    <img src="/Images/HamburgerIconActive.png" alt="hamburg-icon-active" className="hamburger-icon-active"/>
                    <img src="/Images/HamburgerIcon.png" alt="hamburg-icon" className="hamburger-icon"/>
                </div>
                <div className="site-header-content center-element">
                    <Link to={"/"}>
                        <img src="/Images/SiteLogo.png" alt="site-logo" className="site-logo"/>
                    </Link>
                    <Link to={"/IdCreator"}><MainButton component={'Create Id'} btnClass={"main-button nav-button"} /></Link>
                    <Link to={"/EgoCreator"}><MainButton component={'Create Ego'} btnClass={"main-button nav-button"} /></Link>            
                    <Link to={"/Forum"}><MainButton component={'Forum'} btnClass={"main-button nav-button"} /></Link>
                    {loginUser?<Link to={"/User/"+loginUser.id}><MainButton component={"My account"} btnClass="main-button"></MainButton></Link>:
                    <MainButton component={'Login'} btnClass={"main-button nav-button"} clickHandler={()=>setIsLoginMenuActive(!isLoginMenuActive)}/>}
                    {loginUser&&<Link to={"/NewPost"}><MainButton component={"Post"} btnClass="main-button"></MainButton></Link>}
                    <a href="https://ko-fi.com/johnlimbusidmaker" target="_blank">
                        <button className="main-button center-element">
                            <Kofi_icon width="16px" height="16px"/>
                            <p>Support me</p>
                        </button>
                    </a>
                </div>
            </nav>
            <SideBar isActive={isSideBarActive} setActiveSideBar={setActiveSideBar}/>
            <AlertPopUp/>
            <div className="site-content">
                <Outlet/>
            </div>
        </div>

}