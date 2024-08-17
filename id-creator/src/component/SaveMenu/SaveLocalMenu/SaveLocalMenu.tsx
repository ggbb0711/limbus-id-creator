import React from "react";
import "../SaveMenu.css"
import { ISaveFile, SaveFile } from "Interfaces/ISaveFile";
import MainButton from "utils/MainButton/MainButton";
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import useSaveLocal from "utils/Hooks/useSaveLocal";



const SaveLocalMenu=({localSaveName,saveObjInfoValue,loadObjInfoValueCb,isActive,setIsActive}:{localSaveName:string, saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>, loadObjInfoValueCb:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>,isActive:boolean,setIsActive:(a:boolean)=>void})=>{
    const {saveData,changeSaveName,deleteSave,createSave,loadSave,overwriteSave} = useSaveLocal<IIdInfo|IEgoInfo>(localSaveName)


    return<>
            <div className="save-menu-list local">
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
                                    <MainButton component={"Overwrite"} clickHandler={()=>{
                                        saveObjInfoValue.saveTime = new Date().toLocaleString()
                                        overwriteSave(i,saveObjInfoValue)
                                    }} btnClass={"main-button"}/>
                                    <MainButton component={"Load"} clickHandler={()=>{
                                        loadObjInfoValueCb(loadSave(i).saveInfo)
                                        setIsActive(!isActive)
                                    }} btnClass={"main-button"}/>
                                </div>
                            </div>
                        </div>
                    )}
                </>:<p style={{fontFamily:"'Mikodacs' , 'Rubik', sans-serif"}}></p>}
            </div>
            <p>Current local save: {saveData.length}/{process.env.LOCAL_SAVE_MAX_LEN??10}</p>
            <MainButton component={"Create a new save"} clickHandler={()=>{
                    const maxLenStr = process.env.LOCAL_SAVE_MAX_LEN
                    const maxLen = Number(maxLenStr)??10
                    if(saveData.length<maxLen){
                        saveObjInfoValue.saveTime = new Date().toLocaleString()
                        createSave(saveObjInfoValue)
                    }
                }
            } btnClass={"main-button create-new-save-btn"}/>
        </>
}

export {SaveLocalMenu}