import {Header} from "../../component/header";
import React from "react";

export const Forbidden = () => (
    <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <Header rightItem={<h2>Admin panel</h2>}/>
        <div style={{
            display: 'flex',
            flexGrow: '1',
            flexDirection: 'column'
        }}>
            <h1>Forbidden</h1>
        </div>
    </div>
)
