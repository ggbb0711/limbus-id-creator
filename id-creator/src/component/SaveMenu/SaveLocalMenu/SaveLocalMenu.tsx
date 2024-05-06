import React, { createContext, useContext, useState } from "react";
import { ReactElement } from "react";
import "../SaveMenu.css"
import { SaveFile } from "Interfaces/ISaveFile";
import Close_icon from "Icons/Close_icon";
import MainButton from "utils/MainButton/MainButton";
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import useSaveLocal from "utils/Hooks/useSaveLocal";


interface ISaveLocalMenu{
    children:ReactElement,
    localSaveName:string,
    saveObjInfoValue:IIdInfo|IEgoInfo,
    setObjInfoValue:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>
}

const saveLocalMenuContext = createContext(null)

const SaveLocalMenu: React.FC<ISaveLocalMenu>=({children,localSaveName,saveObjInfoValue,setObjInfoValue})=>{
    const [isActive,setIsActive] = useState(false)
    const {saveData,changeSaveName,deleteSave,createSave,loadSave,overwriteSave} = useSaveLocal<IIdInfo|IEgoInfo>(localSaveName)


    return<saveLocalMenuContext.Provider value={{isActive,setIsActive}}>
        <div className={isActive?"save-menu-container":"hidden"}>
            <div className="save-menu-outline">
                <div className="save-menu">
                    <p className="save-menu-header">Save to local machine</p>
                    <span className="close-save-menu" onClick={()=>setIsActive(!isActive)}><Close_icon/></span>
                    <div className="save-menu-list">
                        {saveData.length>0?<>
                            {saveData.map((data,i)=>
                                <div className={`save-tab center-element`} key={data.saveTime}>
                                    {data.previewImg?<img className="save-preview-img" src={data.previewImg} alt="preview-save" />:<></>}
                                    <div>
                                        <p className="created-time">Created on: {data.saveTime}</p>
                                        <div className="center-element save-tab-input-container">
                                            <input className="input" type="text" onChange={(e)=>{
                                                    changeSaveName(i,e.target.value)
                                                }
                                            } value={data.saveName}/>
                                        </div>
                                        <div className="center-element">
                                            <MainButton component={"Delete"} clickHandler={()=>{
                                                    deleteSave(i)
                                                }} btnClass={"main-button"}/>
                                            <MainButton component={"Overwrite"} clickHandler={async()=>{
                                                const newSave = new SaveFile(saveObjInfoValue,saveData[i].saveName,"")
                                                overwriteSave(i,newSave)
                                            }} btnClass={"main-button"}/>
                                            <MainButton component={"Load"} clickHandler={()=>{
                                                setObjInfoValue(loadSave(i).saveInfo)
                                                setIsActive(!isActive)
                                            }} btnClass={"main-button"}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>:<p style={{fontFamily:"'Mikodacs' , 'Rubik', sans-serif"}}>There is no save on your local machine</p>}
                    </div>
                    <MainButton component={"Create a new save"} clickHandler={async()=>{
                            const newSave = new SaveFile(saveObjInfoValue,`New save file (${saveData.length+1})`,"")
                            createSave(newSave)
                        }
                    } btnClass={"main-button"}/>
                </div>
            </div>
            
        </div>
        {children}
    </saveLocalMenuContext.Provider>
}

const useSetSaveIdInfoActive =()=> useContext(saveLocalMenuContext)

export {SaveLocalMenu,useSetSaveIdInfoActive}