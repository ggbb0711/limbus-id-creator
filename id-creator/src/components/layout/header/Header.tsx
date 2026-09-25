'use client'
import React, { useState } from "react";
import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./Header.css"
import KofiIcon from "assets/icons/KofiIcon";
import SideBar from "components/sideBar/SideBar";
import { useLoginMenu } from "hooks/useLoginMenu";
import { useAuth } from "hooks/useAuth";
import siteLogo from "assets/images/SiteLogo.webp";
import hamburgerIcon from "assets/images/HamburgerIcon.webp";
import hamburgerIconActive from "assets/images/HamburgerIconActive.webp";

export default function Header():ReactElement{
    const [isSideBarActive,setActiveSideBar] = useState(false)
    const {setIsLoginMenuActive} = useLoginMenu()
    const {user: loginUser, isInitializing} = useAuth()
    const pathname = usePathname()

    const navClass = (href:string) => `main-button nav-button ${pathname.startsWith(href) ? "active" : ""}`

    return <>
        <nav className="site-header">
            <div className="hamburger-icon-container" onClick={()=>setActiveSideBar(!isSideBarActive)}>
                <Image src={hamburgerIconActive} alt="Open menu" className="hamburger-icon-active" width={35} height={35}/>
                <Image src={hamburgerIcon} alt="Open menu" className="hamburger-icon" width={35} height={35}/>
            </div>
            <div className="site-header-content center-element">
                <Link href="/">
                    <Image src={siteLogo} alt="Limbus ID Creator" className="site-logo" sizes="160px" preload/>
                </Link>
                <Link href="/creator/identity" className={navClass("/creator/identity")}>Create Id</Link>
                <Link href="/creator/ego" className={navClass("/creator/ego")}>Create Ego</Link>
                <Link href="/forum" className={navClass("/forum")}>Forum</Link>
                {isInitializing?<></>:loginUser?
                    <Link href={"/user/"+loginUser.id} className="main-button">My account</Link>:
                    <button className="main-button nav-button" onClick={()=>setIsLoginMenuActive(true)}>Login</button>}
                {loginUser&&<Link href="/new-post" className="main-button">Post</Link>}
                <a href="https://ko-fi.com/johnlimbusidmaker" target="_blank" rel="noreferrer" className="main-button center-element">
                    <KofiIcon width="16px" height="16px"/>
                    <p>Support me</p>
                </a>
            </div>
        </nav>
        <SideBar isActive={isSideBarActive} setActiveSideBar={setActiveSideBar}/>
    </>
}
