import { GoogleOAuthProvider } from '@react-oauth/google';
import HeaderLayout from 'component/Layout/HeaderLayout';
import DisplayPage from 'component/Pages/DisplayPage/DisplayPage';
import EgoCardPage from 'component/Pages/EgoCardPage/EgoCardPage';
import ForumPage from 'component/Pages/ForumPage/ForumPage';
import IdCardPage from 'component/Pages/IdCardPage/IdCardPage';
import NewPostPage from 'component/Pages/NewPostPage/NewPostPage';
import PostPage from 'component/Pages/PostPage/PostPage';
import UserPage from 'component/Pages/UserPage/UserPage';
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
                element:<IdCardPage/>
            },
            {
                path:"User/:userId",
                element:<UserPage/>
            },
            {
                path:"IdCreator",
                element:<IdCardPage/>
            },
            {
                path:'EgoCreator',
                element:<EgoCardPage/>
            },
            {
                path:'Forum',
                element:<ForumPage/>
            },
            {
                path:"NewPost",
                element:<NewPostPage/>
            },
            {
                path:"Post/:postId",
                element: <PostPage/>
            }
        ]
    },
])

// interface IOldLocalSaveFile{
//     saveName:string;
//     saveTime:string;
//     saveInfo:{
//         idInfo:IIdInfo;
//         egoInfo:IEgoInfo;
//     }
// }

function App():ReactElement{
    //This is here to transfer the old local data to the new local save
    // useEffect(()=>{
    //     try {
    //         const oldSave = JSON.parse(localStorage.getItem('SaveTabs'))
    //         if(oldSave&&JSON.parse(localStorage.getItem('IdLocalSaves'))&&JSON.parse(localStorage.getItem('EgoLocalSaves'))){
    //             localStorage.setItem('IdLocalSaves',JSON.stringify([]))
    //             localStorage.setItem('EgoLocalSaves',JSON.stringify([]))

    //             const oldIdSaves:ISaveFile<IIdInfo>[] = []
    //             const oldEgoSaves:ISaveFile<IEgoInfo>[] = []

    //             oldSave.forEach((save:IOldLocalSaveFile) => {
    //                 oldIdSaves.push(new SaveFile(save.saveInfo.idInfo,save.saveName))
    //                 oldEgoSaves.push(new SaveFile(save.saveInfo.egoInfo,save.saveName))
    //             })

    //             localStorage.setItem('IdLocalSaves',JSON.stringify(oldIdSaves))
    //             localStorage.setItem('EgoLocalSaves',JSON.stringify(oldEgoSaves))
    //             localStorage.removeItem('SaveTabs')
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    // },[])
    // return <GoogleOAuthProvider clientId=''>
    //     <RouterProvider router={router}/>
    // </GoogleOAuthProvider> 
    return <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router}/>
    </GoogleOAuthProvider> 
}

root.render(
    <App/>
);
