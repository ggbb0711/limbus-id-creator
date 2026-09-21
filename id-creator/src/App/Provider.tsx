import AlertPopUp from "Components/AlertPopUp/AlertPopUp";
import { LoginMenu } from "Components/LoginMenu/LoginMenu";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { EnvironmentVariables } from "Config/Environments";
import { EditorProvider } from "react-simple-wysiwyg";
import { Provider as ReduxProvider } from 'react-redux';
import { AppStore } from "Stores/AppStore";
import AuthBootstrap from "./AuthBootstrap";

export default function Provider({children}:{children: ReactNode}){
     return (
         <GoogleOAuthProvider clientId={EnvironmentVariables.REACT_APP_GOOGLE_CLIENT_ID!}>
             <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                <ReduxProvider store={AppStore}>
                    <EditorProvider>
                        <AuthBootstrap/>
                        <LoginMenu/>
                        {children}
                        <AlertPopUp />
                    </EditorProvider>
                </ReduxProvider>
             </DndProvider>
         </GoogleOAuthProvider>
     );
}
