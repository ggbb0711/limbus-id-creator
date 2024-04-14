import React, { ReactElement } from "react";
import "./InputTab.css"
import Delete_icon from "Icons/Delete_icon";

export default function InputTab({tabName,tabColor,tabIcon,clickHandler,deleteHandler,isActive}:{tabName:string,tabColor:string,tabIcon?:string,clickHandler,deleteHandler?,isActive:boolean}):ReactElement{
    return(
        <div className={`input-tab ${isActive?"active":""}`} style={{background:tabColor}} onClick={clickHandler}>
            {tabIcon?<img src={tabIcon} alt="tab-icon" className="tab-icon" />:<></>}
            <p className="tab-content">
                {tabName}
            </p>
            {deleteHandler?
            <span className="delete-tab-icon" onClick={(e:React.MouseEvent<HTMLElement>)=>{
                    e.stopPropagation()
                    deleteHandler()
                }}>
                <Delete_icon/>
            </span>:<></>}
        </div>
    )
}