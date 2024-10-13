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
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import DragAndDroppableSkillPreviewLayer from 'component/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';

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


function App():ReactElement{
    useEffect(()=>{
        const keyStorageName = ["currEgoSave","EgoLocalSaves","currIdSave","IdLocalSaves"]
        for (let i = 0; i < localStorage.length; i++) {
            if(!keyStorageName.includes(localStorage.key(i))){
                localStorage.removeItem(localStorage.key(i))
            }
        }
    },[])
    return <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <DndProvider backend={TouchBackend}
            options={{ enableMouseEvents: true }}>
            <DragAndDroppableSkillPreviewLayer/>
            <RouterProvider router={router}/>
        </DndProvider>
    </GoogleOAuthProvider> 
}

root.render(
    <App/>
);
