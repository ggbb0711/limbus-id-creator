import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./SaveMenu.css"
import { ISaveFile } from "Interfaces/ISaveFile";
import { useIdInfoContext } from "component/context/IdInfoContext";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import Close_icon from "Icons/Close_icon";


export default function SaveMenu({isActive,setIsActive}:{isActive:boolean,setIsActive}):ReactElement{
    const [saveTabs,setSaveTabs] = useState<ISaveFile[]>([])
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()

    function changeSaveName(index:number){
        return (e:React.ChangeEvent<HTMLInputElement>)=>{
            const newSaveTabs=[...saveTabs]
            newSaveTabs[index].saveName=e.target.value
            setSaveTabs(newSaveTabs)
        }
    }

    function createNewSave(){
        const newSaveTabs=[...saveTabs]
        newSaveTabs.unshift({
            saveName:"New save file ("+(newSaveTabs.length+1)+")",
            saveTime:new Date().toLocaleString(),
            saveInfo:{
                idInfo:idInfoValue,
                egoInfo:EgoInfoValue
            }
        })
        setSaveTabs(newSaveTabs)
    }

    function loadSave(index:number){
        return ()=>{
            setIdInfoValue(saveTabs[index].saveInfo.idInfo)
            setEgoInfoValue(saveTabs[index].saveInfo.egoInfo)
            setIsActive(!isActive)
        }
    }
    
    function deleteSave(index:number){
        return ()=>{
            const newSaveTabs=[...saveTabs]
            newSaveTabs.splice(index,1)
            setSaveTabs(newSaveTabs)
        }
    }

    function overWriteSave(index:number){
        return ()=>{
            const newSaveTabs=[...saveTabs]
            newSaveTabs[index].saveInfo.idInfo=idInfoValue
            newSaveTabs[index].saveInfo.egoInfo=EgoInfoValue
            setSaveTabs(newSaveTabs)
        }
    }

    useEffect(()=>{
        if(localStorage.getItem("SaveTabs")){
            setSaveTabs(JSON.parse(localStorage.getItem("SaveTabs")))
        }
        else{
            localStorage.setItem("SaveTabs",JSON.stringify([]))
        }
    },[])

    useEffect(()=>{
        localStorage.setItem("SaveTabs",JSON.stringify(saveTabs))
    },[JSON.stringify(saveTabs)])

    return <div className={isActive?"save-menu-container":"hidden"}>
        <div className="save-menu-outline">
            <div className="save-menu">
                <p className="save-menu-header">Save to local machine</p>
                <span className="close-save-menu" onClick={()=>setIsActive(!isActive)}><Close_icon/></span>
                <div className="save-menu-list">
                    {saveTabs.length>0?<>
                        {saveTabs.map((saveTab,i)=>
                            <div className={`save-tab`} key={i}>
                                <p className="created-time">Created on: {saveTab.saveTime}</p>
                                <div className="center-element save-tab-input-container">
                                    <input className="input" type="text" onChange={changeSaveName(i)} value={saveTab.saveName}/>
                                </div>
                                <div className="center-element">
                                    <button className="delete-save-btn" onClick={deleteSave(i)}>Delete save</button>
                                    <button className="overwrite-save-btn" onClick={overWriteSave(i)}>Overwrite save</button>
                                    <button onClick={loadSave(i)} className={`load-save-btn`}>Load save</button>
                                </div>
                            </div>
                        )}
                    </>:<p style={{fontFamily:"'Mikodacs' , 'Rubik', sans-serif"}}>There is no save on your local machine</p>}
                </div>
                <button onClick={createNewSave} className="new-save-btn">Create a new save</button>
            </div>
        </div>
        
    </div>
}