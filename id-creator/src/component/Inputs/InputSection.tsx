import React, { ReactElement } from "react";
import { useIdInfoContext } from "../context/IdInfoContext";
import GeneralInput from "./GeneralInput/GeneralInput";
import IdColInputContainer from "./IdColInput/IdColInputContainer";

export default function InputSection():ReactElement{


    return(
        <IdColInputContainer/>
    )
}