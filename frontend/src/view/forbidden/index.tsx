import {Header} from "../../component/header";
import React from "react";
import {HeroMessage} from "../../component/hero-message";

export const Forbidden = () => (
    <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <Header/>
        <HeroMessage><h1>Forbidden</h1></HeroMessage>
    </div>
)
