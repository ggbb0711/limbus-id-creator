'use client'
import React, { useState } from "react";
import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./Header.css"
import KofiIcon from "assets/icons/KofiIcon";
import SideBar, { SIDE_BAR_ID } from "components/layout/header/SideBar";
import { SITE_LINKS } from "config/siteLinks";
import { useAuth } from "hooks/useAuth";
import siteLogo from "assets/images/SiteLogo.webp";
import hamburgerIcon from "assets/images/HamburgerIcon.webp";
import hamburgerIconActive from "assets/images/HamburgerIconActive.webp";
import LoginPromptButton from "components/loginMenu/LoginPromptButton";
import { NAV_LINKS } from "config/navLinks";

export default function Header():ReactElement{
    const [isSideBarActive,setActiveSideBar] = useState(false)
    const {user: loginUser, isInitializing} = useAuth()
    const pathname = usePathname()

    const navClass = (href:string) => `main-button nav-button ${pathname.startsWith(href) ? "active" : ""}`

    return <>
        <nav className="site-header">
            <button type="button" className="icon-button hamburger-icon-container" aria-label="Open menu" aria-expanded={isSideBarActive} aria-controls={SIDE_BAR_ID} onClick={()=>setActiveSideBar(!isSideBarActive)}>
                <Image src={hamburgerIconActive} alt="" className="hamburger-icon-active" width={35} height={35}/>
                <Image src={hamburgerIcon} alt="" className="hamburger-icon" width={35} height={35}/>
            </button>
            <div className="site-header-content center-element">
                <Link href="/">
                    <Image src={siteLogo} alt="Limbus ID Creator" className="site-logo" sizes="160px"/>
                </Link>
                {NAV_LINKS.map(link => <Link key={link.href} href={link.href} className={navClass(link.href)}>{link.label}</Link>)}
                {isInitializing?<></>:loginUser?
                    <Link href={"/user/"+loginUser.id} className="main-button">My account</Link>:
                    <LoginPromptButton className="main-button nav-button"/>}
                {loginUser&&<Link href="/new-post" className="main-button">Post</Link>}
                <a href={SITE_LINKS.kofi} target="_blank" rel="noreferrer" className="main-button center-element">
                    <KofiIcon width="16px" height="16px"/>
                    <p>Support me</p>
                </a>
            </div>
        </nav>
        <SideBar isActive={isSideBarActive} setActiveSideBar={setActiveSideBar}/>
    </>
}
