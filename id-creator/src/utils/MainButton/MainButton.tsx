import React from "react";
import { ReactElement } from "react";

export default function MainButton({component,clickHandler,btnClass}:{component:ReactElement|string,clickHandler?:()=>void,btnClass:string}):ReactElement{
    return <button className={btnClass} onClick={clickHandler}>
        {component}
    </button>
}