import React, { useState } from "react";
import { ReactElement } from "react";
import {Link} from "react-router-dom";
import "./HeaderLayout.css"
import KofiIcon from "Assets/Icons/KofiIcon";
import SideBar from "Components/SideBar/SideBar";
import { useLoginMenu } from "Hooks/useLoginMenu";
import { useAuth } from "Hooks/useAuth";

export default function HeaderLayout():ReactElement{
    const [isSideBarActive,setActiveSideBar] = useState(false)
    const {setIsLoginMenuActive} = useLoginMenu()
    const {user: loginUser} = useAuth()

    return <>
        <nav className="site-header">
            <div className="hamburger-icon-container" onClick={()=>setActiveSideBar(!isSideBarActive)}>
                <img src="/Images/HamburgerIconActive.webp" alt="hamburg-icon-active" className="hamburger-icon-active"/>
                <img src="/Images/HamburgerIcon.webp" alt="hamburg-icon" className="hamburger-icon"/>
            </div>
            <div className="site-header-content center-element">
                <Link to={"/"}>
                    <img src="/Images/SiteLogo.webp" alt="site-logo" className="site-logo"/>
                </Link>
                <Link to={"/creator/identity"}>
                    <button className="main-button nav-button">
                        Create Id
                    </button>
                </Link>
                <Link to={"/creator/ego"}>
                    <button className="main-button nav-button">
                        Create Ego
                    </button>
                </Link>            
                <Link to={"/forum"}>
                    <button className="main-button nav-button">
                        Forum
                    </button>
                </Link>
                {loginUser?<Link to={"/user/"+loginUser.id}>
                    <button className="main-button">My account</button>
                </Link>:
                <button className={"main-button nav-button"} onClick={()=>setIsLoginMenuActive(true)}>Login</button>}
                {loginUser&&<Link to={"/new-post"}><button className="main-button">Post</button></Link>}
                <a href="https://ko-fi.com/johnlimbusidmaker" target="_blank" rel="noreferrer">
                    <button className="main-button center-element">
                        <KofiIcon width="16px" height="16px"/>
                        <p>Support me</p>
                    </button>
                </a>
            </div>
        </nav>
        <SideBar isActive={isSideBarActive} setActiveSideBar={setActiveSideBar}/>
    </>
}