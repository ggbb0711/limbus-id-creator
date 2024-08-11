import React from "react";
import { ReactElement } from "react";
import './CardTag.css'
import { ITag } from "utils/TagList";

export default function CardTag({card}:{card:ITag}):ReactElement{
    return <div className="card-tag center-element">
        {card?.icon&&<img className="card-tag-img" src={card?.icon} alt="card-tag"/>}
        <p>{card?.tagName}</p>
    </div>
}