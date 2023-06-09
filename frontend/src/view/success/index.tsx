import {Header} from "../../component/header";
import React from "react";
import {HeroMessage} from "../../component/hero-message";
import {useParams} from "react-router-dom";

export const Success: React.FC = () => {

    const {transactionId} = useParams()

    return (
        <div style={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Header/>
            <HeroMessage><h1>Success transaction {transactionId}</h1></HeroMessage>
        </div>
    )
}
