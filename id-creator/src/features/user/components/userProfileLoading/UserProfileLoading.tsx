import React, { ReactElement } from "react";
import "./UserProfileLoading.css"
import Spinner from "components/ui/spinner/Spinner";

export default function UserProfileLoading():ReactElement{
    return <div className="user-personal-container center-element">
        <div className="user-personal-icon"><Spinner/></div>
        <p className="user-name">Fetching user...</p>
    </div>
}