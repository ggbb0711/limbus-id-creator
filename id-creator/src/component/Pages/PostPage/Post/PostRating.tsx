import Thumb_down_icon from "Icons/Thumb_down_icon";
import Thumb_up_icon from "Icons/Thumb_up_icon";
import React from "react";
import MainButton from "utils/MainButton/MainButton";

export default function ShowIdEgoRating({rating,ratingChoice}:{rating:number,ratingChoice:string}){
    return <div className="center-element">
        <MainButton btnClass={`main-button ${(ratingChoice==="Like")?" active":""}`} component={<p className="center-element"><Thumb_up_icon/>Like</p>} />
        {rating}
        <MainButton btnClass={`main-button ${(ratingChoice==="DiskLike")?" active":""}`} component={<p className="center-element"><Thumb_down_icon/>Dislike</p>} />
    </div>
}