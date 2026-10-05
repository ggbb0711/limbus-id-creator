'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./SideBar.css"
import KofiIcon from "assets/icons/KofiIcon";
import { useLoginMenu } from "hooks/useLoginMenu";
import { useAuth } from "hooks/useAuth";
import siteLogo from "assets/images/SiteLogo.webp";


export default function SideBar({isActive,setActiveSideBar}:{isActive:boolean,setActiveSideBar:(a:boolean)=>void}){
    const {setIsLoginMenuActive} = useLoginMenu()
    const {user: loginUser} = useAuth()
    const close = ()=>setActiveSideBar(false)

    return <div className={`side-bar-container ${isActive?"":"hidden"}`}>
        <div className="side-bar-background" onClick={()=>setActiveSideBar(!isActive)}></div>
        <div className="side-bar-outline">
            <div className="side-bar">
                <Link href="/" onClick={close}>
                    <Image src={siteLogo} alt="Limbus ID Creator" className="site-logo" sizes="300px"/>
                </Link>
                <div className="side-bar-nav">
                    <Link href="/creator/identity" onClick={close} className="main-button nav-button">Create Id</Link>
                    <Link href="/creator/ego" onClick={close} className="main-button nav-button">Create Ego</Link>
                    <Link href="/forum" onClick={close} className="main-button nav-button">Forum</Link>
                    {loginUser?
                        <Link href={"/user/"+loginUser.id} onClick={close} className="main-button">My account</Link>:
                        <button className={"main-button nav-button"} onClick={()=>setIsLoginMenuActive(true)}>Login</button>}
                    {loginUser&&<Link href="/new-post" onClick={close} className="main-button">Post</Link>}
                    <a href="https://ko-fi.com/johnlimbusidmaker" target="_blank" rel="noreferrer" style={{justifyContent:"center"}} className="main-button center-element">
                        <KofiIcon width="16px" height="16px"/>
                        <p>Support me</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
}
