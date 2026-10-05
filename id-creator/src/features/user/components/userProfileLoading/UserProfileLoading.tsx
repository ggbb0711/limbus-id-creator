import React, { ReactElement } from "react";
import "./UserProfileLoading.css"

export default function UserProfileLoading():ReactElement{
    return <div className="user-personal-container center-element">
        <div className="user-personal-icon"><div className="loader"></div></div>
        <p className="user-name">Fetching user...</p>
    </div>
}