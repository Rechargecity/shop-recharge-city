import {Header} from "../../component/header";
import {AdaptiveHeaderText} from "../../component/adaptive";
import React from "react";
import {HeroMessage} from "../../component/hero-message";

export const Success: React.FC = () => {

    // const {transactionId} = useParams()

    return (
        <div style={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Header/>
            <HeroMessage>
                <AdaptiveHeaderText>
                    Thank you!<br/>
                    Your payment has been processed successfully
                </AdaptiveHeaderText>
            </HeroMessage>
        </div>
    )
}
