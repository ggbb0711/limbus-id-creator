import { useIdInfoContext } from "component/context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import './styles/IdCard.css'


export default function IdCard():ReactElement{
    const {idInfoValue}=useIdInfoContext()

    return(
        <div className="idCard">
            <div>
                <div>
                    <p>Name: {idInfoValue.name}</p>
                    <p>Title: {idInfoValue.title}</p>
                    
                </div>
                <div>
                    <img src={idInfoValue.splashArt} alt="splashArt" />
                </div>
            </div>
        </div>
    )
}