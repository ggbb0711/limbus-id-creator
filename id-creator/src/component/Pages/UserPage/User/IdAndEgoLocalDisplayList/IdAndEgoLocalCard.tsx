import React from "react";
import { ReactElement } from "react";
import "./IdAndEgoLocalDisplayList.css"
import { Link } from "react-router-dom";

export default function IdAndEgoLocalCard({saveName,saveTime,mode,saveId}):ReactElement{
    return <Link to={`${mode==="Identity"?"IdCreator":"EgoCreator"}?saveMode=local&id=${saveId}`}>
        <div className="id-ego-local-card">
            <p className="id-ego-local-card-save-time">Created time: {saveTime}</p>
            <p className="id-ego-local-card-name">{saveName}</p>
        </div>
    </Link>
}