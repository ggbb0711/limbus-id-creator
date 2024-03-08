import React, { ReactElement } from "react";
import useInput from "../util/useInput";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";


export default function MentalEffectInput({colIndex,inputIndex}:{colIndex:number,inputIndex:number}):ReactElement{
    const {inputs,onChangeInput,deleteInput}=useInput(colIndex,inputIndex)
    
    return(
        <div>
            <button onClick={deleteInput}>Delete</button>
            <div>
                <label htmlFor={colIndex+inputIndex+"_effect"}>Mental effect:</label>
                <input type="text" name="effect" id={colIndex+inputIndex+"_effect"} value={(inputs as IMentalEffect).effect} onChange={onChangeInput}/>
            </div>
        </div>
    )
}