import EgoCardPage from 'component/Pages/EgoCardPage';
import IdCardPage from 'component/Pages/IdCardPage';
import React, { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';


const root = createRoot(document.getElementById('root')!);

function App():ReactElement{

    return <EgoCardPage/>
}

root.render(
    <App/>
);
