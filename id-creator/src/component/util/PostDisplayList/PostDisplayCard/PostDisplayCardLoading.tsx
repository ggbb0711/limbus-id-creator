import React from "react";
import { ReactElement } from "react";
import './PostDisplayCard.css'

export default function PostDisplayCardLoading():ReactElement{
    return <div className="post-display-card-loading">
        <div className="loader"></div>
    </div>
}