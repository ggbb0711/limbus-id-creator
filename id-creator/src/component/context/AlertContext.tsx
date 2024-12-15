import React, { createContext } from 'react'
import { Alert, IAlert } from "Interfaces/Utils/IAlert";
import { ReactElement, useContext, useEffect, useState } from "react";


interface AlertContextProps {
    alertArr: IAlert[]
    addAlert: (status:string,msg:string)=>void
}


const alertContext = createContext<AlertContextProps>(null)

const AlertContextProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [alertArr,setAlertArr] = useState<IAlert[]>([])

    function addAlert(status:string,msg:string){
        const newAlert = new Alert(status,msg)
        setAlertArr([...alertArr,newAlert])


        setTimeout(() => {
            setAlertArr(alertArr.filter(alert=>alert.alertId!==newAlert.alertId))
        }, 4000);
    }


    return <alertContext.Provider value={{alertArr,addAlert}}>
            {children}
        </alertContext.Provider>;
}

const useAlertContext = () => useContext(alertContext)

export {AlertContextProvider,useAlertContext}