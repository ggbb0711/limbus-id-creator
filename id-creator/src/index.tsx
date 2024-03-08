import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css'
import './styles/style.css'
import { IdInfoProvider } from './component/context/IdInfoContext';
import InputSection from './component/Inputs/InputSection';
import IdCard from 'component/IdCard/IdCard';
import IdCardImg from 'component/IdCard/IdCardImg';
import GeneralInput from 'component/Inputs/GeneralInput/GeneralInput';

const root = createRoot(document.getElementById('root')!);
root.render(
    <div>
        <IdInfoProvider>
            <>
                <IdCardImg/>
                <GeneralInput/>
            </>
            
        </IdInfoProvider>
    </div>
);
