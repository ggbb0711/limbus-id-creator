import React from "react";
import { useIdInfoContext } from "component/context/IdInfoContext";
import { ReactElement } from "react";
import DropDown from "component/DropDown/DropDown";


export default function GeneralInput():ReactElement{
    const {idInfoValue,setIdInfoValue}= useIdInfoContext();


    function onTextAndNumberInputChange(e:React.ChangeEvent<HTMLInputElement>){
        setIdInfoValue({...idInfoValue,[e.target.name]:e.currentTarget.value})
    }

    function onFileInputChange(e:React.ChangeEvent<HTMLInputElement>){
        const files=e.currentTarget.files
        setIdInfoValue({...idInfoValue,[e.target.name]:(files)?URL.createObjectURL(files[0]):""})
    }

    return(
        <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" onChange={onTextAndNumberInputChange} value={idInfoValue.name}/>

            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" onChange={onTextAndNumberInputChange} value={idInfoValue.title}/>

            <label htmlFor="splashArt">Upload the ids splash art:</label>
            <input type="file" id="splashArt" name="splashArt" onChange={onFileInputChange}/>

            <label htmlFor="HP">HP:</label>
            <input type="number" id="HP" name="HP" onChange={onTextAndNumberInputChange} value={idInfoValue.HP}/>

            <label htmlFor="defenseLevel">Defense level</label>
            <input type="number" id="defenseLevel" name="defenseLevel" onChange={onTextAndNumberInputChange} value={idInfoValue.defenseLevel}/>

            <label htmlFor="minSpeed">Min speed:</label>
            <input type="number" id="minSpeed" name="minSpeed" onChange={onTextAndNumberInputChange} value={idInfoValue.minSpeed}/>

            <label htmlFor="maxSpeed">Max speed:</label>
            <input type="number" id="maxSpeed" name="maxSpeed" onChange={onTextAndNumberInputChange} value={idInfoValue.maxSpeed}/>
        </div>
    )
}