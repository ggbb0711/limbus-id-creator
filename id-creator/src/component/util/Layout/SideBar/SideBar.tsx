import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css"
import MainButton from "utils/MainButton/MainButton";
import { useLoginMenuContext } from "component/util/LoginMenu/LoginMenu";
import { useLoginUserContext } from "component/context/LoginUserContext";
import Kofi_icon from "Icons/Kofi_icon";


export default function SideBar({isActive,setActiveSideBar}:{isActive:boolean,setActiveSideBar:(a:boolean)=>void}){
    const {isLoginMenuActive,setIsLoginMenuActive} = useLoginMenuContext()
    const {loginUser} = useLoginUserContext()

    return <div className={`side-bar-container ${isActive?"":"hidden"}`}>
        <div className="side-bar-background" onClick={()=>setActiveSideBar(!isActive)}></div>
        <div className="side-bar-outline">
            <div className="side-bar">
                <Link to={"/"}>
                    <img src="/Images/SiteLogo.png" alt="site-logo" className="site-logo" onClick={()=>setActiveSideBar(!isActive)}/>
                </Link>
                <div className="side-bar-nav">
                    <Link to={"/IdCreator"}><MainButton component={'Create Id'} btnClass={"main-button nav-button"} clickHandler={()=>setActiveSideBar(!isActive)}/></Link>
                    <Link to={"/EgoCreator"}><MainButton component={'Create Ego'} btnClass={"main-button nav-button"} clickHandler={()=>setActiveSideBar(!isActive)}/></Link>            
                    <Link to={"/Forum"}><MainButton component={'Forum'} btnClass={"main-button nav-button"} clickHandler={()=>setActiveSideBar(!isActive)}/></Link>
                    {loginUser?<Link to={"/User/"+loginUser.id}><MainButton component={"My account"} btnClass="main-button" clickHandler={()=>setActiveSideBar(!isActive)}></MainButton></Link>:
                    <MainButton component={'Login'} btnClass={"main-button nav-button"} clickHandler={()=>setIsLoginMenuActive(!isLoginMenuActive)}/>}
                    {loginUser&&<Link to={"/NewPost"}><MainButton component={"Post"} btnClass="main-button" clickHandler={()=>setActiveSideBar(!isActive)}></MainButton></Link>}
                    <Link to="https://ko-fi.com/johnlimbusidmaker" target="_blank">
                        <button style={{justifyContent:"center"}} className="main-button center-element">
                            <Kofi_icon width="16px" height="16px"/>
                            <p>Support me</p>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
}