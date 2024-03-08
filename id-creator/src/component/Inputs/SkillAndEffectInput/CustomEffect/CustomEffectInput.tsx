import React from "react";
import { ReactElement } from "react";
import useInput from "../util/useInput";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";


export default function CustomEffectInput({colIndex,inputIndex}:{colIndex:number,inputIndex:number}):ReactElement{
    const {inputs,onChangeInput,onChangeFile,deleteInput} = useInput(colIndex,inputIndex)
    
    return(
        <div>
            <button onClick={deleteInput}>Delete</button>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_name'}>Effect name:</label>
                <input type="text" name="name" id={colIndex+'_'+inputIndex+'_name'} onChange={onChangeInput} value={(inputs as ICustomEffect).name} placeholder="Effect name"/>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_effect'}>Effect:</label>
                <textarea name="effect" id={colIndex+'_'+inputIndex+'_effect'} onChange={onChangeInput} value={(inputs as ICustomEffect).effect} placeholder="Effect"></textarea>
            </div>
            <div>
                <label htmlFor={colIndex+'_'+inputIndex+'_effectColor'}>Effect color:</label>
                <input type="color" name="effectColor" id={colIndex+'_'+inputIndex+'_effectColor'} onChange={onChangeInput} value={(inputs as ICustomEffect).effectColor}/>
            </div>
            <div>
                <input type="file" name="customImg" id={colIndex+'_'+inputIndex+'_customImg'} onChange={onChangeFile}/>
            </div>
        </div>
    )
}