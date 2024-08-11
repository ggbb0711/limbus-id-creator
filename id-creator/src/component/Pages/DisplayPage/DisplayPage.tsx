import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "../PageLayout.css"
import "./DisplayPage.css"
import { Link } from "react-router-dom";
import MainButton from "utils/MainButton/MainButton";
import IdAndEgoDisplayList from "component/PostDisplayList/PostDisplayList";


export default function DisplayPage():ReactElement{
    const [cardList,setCardList] = useState([])

    useEffect(()=>{
        
    },[])
    
    return <div className="page-container">
        <div className="page-content">
            <div className="display-page-heading-container">
                <div>
                    <h1 className="display-page-heading">Welcome,</h1>
                </div>
                <p className="description-txt">This is the limbus company id creator. You can create your own id or ego here.</p>

                <div className="center-element">
                    <Link to={"/IdCreator"}><MainButton component={'Create Id'} btnClass={"main-button display-page-heading-link-button"} /></Link>
                    <Link to={"/EgoCreator"}><MainButton component={'Create Ego'} btnClass={"main-button display-page-heading-link-button"} /></Link>
                </div>
            </div>
            <h2 className="page-content-large-txt">Newest Id/Ego</h2>
            <p className="description-txt">These are the newset Id/Ego</p>
            <IdAndEgoDisplayList isLoading={true} cardList={[]}/>
        </div>
    </div>
}