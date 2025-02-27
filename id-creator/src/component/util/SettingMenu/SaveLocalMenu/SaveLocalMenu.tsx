import React, { useEffect } from "react";
import "../SettingMenu.css"
import { ISaveFile, SaveFile } from "Interfaces/ISaveFile";
import MainButton from "utils/MainButton/MainButton";
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import useSaveLocal from "utils/Hooks/useSaveLocal";
import uuid from "react-uuid";



const SaveLocalMenu=({localSaveName,saveObjInfoValue,loadObjInfoValueCb,isActive,setIsActive}:{localSaveName:string, saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>, loadObjInfoValueCb:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>,isActive:boolean,setIsActive:(a:boolean)=>void})=>{
    const {saveData,changeSaveName,deleteSave,createSave,loadSave,overwriteSave} = useSaveLocal<IIdInfo|IEgoInfo>(localSaveName)

    //Some of the save can have the same id
    //This is to create new save for some 
    //of the save with same id
    useEffect(()=>{
        saveData.map(save=>{
            if(saveData.some(s=>s.id===save.id)||!save.id) save.id = uuid()
            return save
        })
    },[localSaveName])

    return<>
            <div className="save-menu-list local">
                {saveData.length>0?<>
                    {saveData.map((data,i)=>
                        <div className={`save-tab center-element`} key={data.id}>
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
            <p>Current local save: {saveData.length}/{process.env.REACT_APP_LOCAL_SAVE_MAX_LEN??10}</p>
            <MainButton component={"Create a new save"} clickHandler={()=>{
                    const maxLenStr = process.env.REACT_APP_LOCAL_SAVE_MAX_LEN
                    const maxLen = Number(maxLenStr)??10
                    if(saveData.length<maxLen){
                        saveObjInfoValue.id = uuid()
                        saveObjInfoValue.saveTime = new Date().toLocaleString()
                        createSave(saveObjInfoValue)
                    }
                }
            } btnClass={"main-button create-new-save-btn"}/>
        </>
}

export {SaveLocalMenu}