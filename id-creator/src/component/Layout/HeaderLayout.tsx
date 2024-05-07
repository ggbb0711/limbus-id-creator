import React from "react";
import { ReactElement } from "react";
import {Link, Outlet} from "react-router-dom";
import "./HeaderLayout.css"
import MainButton from "utils/MainButton/MainButton";

export default function HeaderLayout():ReactElement{
    return <div className="site-layout">
        <header className="site-header center-element">
            <Link to={"/"}><MainButton component={'Id'} btnClass={"main-button nav-button"} /></Link>
            <Link to={"/EgoCreator"}><MainButton component={'Ego'} btnClass={"main-button nav-button"} /></Link>            
        </header>
        <div className="site-content">
            <Outlet/>
        </div>
    </div>
}