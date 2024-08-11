import React, { useState } from "react";
import { ReactElement } from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import "./HeaderLayout.css"
import MainButton from "utils/MainButton/MainButton";
import { RefDownloadProvider } from "component/context/ImgUrlContext";
import { SaveMenu, useSaveMenuContext } from "component/SaveMenu/SaveMenu";
import SideBar from "./SideBar/SideBar";
import { AlertContextProvider } from "component/context/AlertContext";
import AlertPopUp from "./AlertPopUp/AlertPopUp";
import SideBarDownloadBtn from "./SideBarDownloadBtn/SideBarDownloadBtn";
import { LoginMenu, useLoginMenuContext } from "component/LoginMenu/LoginMenu";
import { LoginUserContextProvider, useLoginUserContext } from "component/context/LoginUserContext";
import Save_icon from "Icons/Save_icon";

export default function HeaderLayout():ReactElement{

    return <LoginUserContextProvider>
        <AlertContextProvider>
            <RefDownloadProvider>
                <LoginMenu>
                    <SaveMenu>
                        <HeaderLayoutContent/>
                    </SaveMenu>
                </LoginMenu>
            </RefDownloadProvider>
        </AlertContextProvider>
    </LoginUserContextProvider> 
}


function HeaderLayoutContent():ReactElement{
    const location = useLocation()
    const [isSideBarActive,setActiveSideBar] = useState(false)
    const {isActive,setIsActive} = useSaveMenuContext()
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
                </div>
                <div className="center-element">
                    {(location.pathname.match("/IdCreator")||location.pathname.match("/EgoCreator")||location.pathname==="/")?
                        <>
                            <SideBarDownloadBtn/>
                            <MainButton component={<>
                                <Save_icon/>
                                <p>Save</p>
                            </>} btnClass={"main-button center-element"} clickHandler={()=>setIsActive(!isActive)}/>
                        </>:<></>
                    }
                </div>
            </nav>
            <SideBar isActive={isSideBarActive} setActiveSideBar={setActiveSideBar}/>
            <AlertPopUp/>
            <div className="site-content">
                <Outlet/>
            </div>
        </div>

}