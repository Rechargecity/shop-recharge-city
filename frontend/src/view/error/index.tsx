import {Header} from "../../component/header";
import React from "react";
import {HeroMessage} from "../../component/hero-message";
import {useSearchParams} from "react-router-dom";

export const Error: React.FC = () => {

    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') || 'Something went wrong'

    return (
        <div style={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Header/>
            <HeroMessage><h1>{message}</h1></HeroMessage>
        </div>
    )
}
