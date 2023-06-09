import React, {ReactNode} from "react";

interface Props {
    children: ReactNode
}

export const HeroMessage: React.FC<Props> = (props) => (
    <main style={{
        display: 'flex',
        flexGrow: '1',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10vh'
    }}>
        {props.children}
    </main>
)
