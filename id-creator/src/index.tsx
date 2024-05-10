import HeaderLayout from 'component/Layout/HeaderLayout';
import DisplayPage from 'component/Pages/DisplayPage/DisplayPage';
import EgoCardPage from 'component/Pages/EgoCardPage/EgoCardPage';
import IdCardPage from 'component/Pages/IdCardPage/IdCardPage';
import ShowIdEgoPage from 'component/Pages/ShowIdEgoPage/ShowIdEgoPage';
import UserPage from 'component/Pages/UserPage/UserPage';
import ShowIdEgo from 'component/ShowIdEgo/ShowIdEgo';
import { IEgoInfo } from 'Interfaces/IEgoInfo';
import { IIdInfo } from 'Interfaces/IIdInfo';
import { ISaveFile, SaveFile } from 'Interfaces/ISaveFile';
import React, { ReactElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, json, RouterProvider } from 'react-router-dom';


const root = createRoot(document.getElementById('root')!);

const router = createBrowserRouter([
    {
        path:'/',
        element:<HeaderLayout/>,
        children:[
            {
                path:"",
                element:<UserPage/>
            },
            {
                path:"IdCreator",
                element:<IdCardPage/>

            },
            {
                path:'EgoCreator',
                element:<EgoCardPage/>
            }
        ]
    },
])

interface IOldLocalSaveFile{
    saveName:string;
    saveTime:string;
    saveInfo:{
        idInfo:IIdInfo;
        egoInfo:IEgoInfo;
    }
}

function App():ReactElement{
    //This is here to transfer the old local data to the new local save
    useEffect(()=>{
        const oldSave = JSON.parse(localStorage.getItem('SaveTabs'))
        if(oldSave&&JSON.parse(localStorage.getItem('IdLocalSaves'))&&JSON.parse(localStorage.getItem('EgoLocalSaves'))){
            try{
                localStorage.setItem('IdLocalSaves',JSON.stringify([]))
                localStorage.setItem('EgoLocalSaves',JSON.stringify([]))
    
                const oldIdSaves:ISaveFile<IIdInfo>[] = []
                const oldEgoSaves:ISaveFile<IEgoInfo>[] = []
    
                oldSave.forEach((save:IOldLocalSaveFile) => {
                    oldIdSaves.push(new SaveFile(save.saveInfo.idInfo,save.saveName))
                    oldEgoSaves.push(new SaveFile(save.saveInfo.egoInfo,save.saveName))
                })
    
                localStorage.setItem('IdLocalSaves',JSON.stringify(oldIdSaves))
                localStorage.setItem('EgoLocalSaves',JSON.stringify(oldEgoSaves))
                localStorage.removeItem('SaveTabs')
            }
            catch(err){
                console.log(err)
            }
        }
    },[])
    return <RouterProvider router={router}/>
}

root.render(
    <App/>
);
