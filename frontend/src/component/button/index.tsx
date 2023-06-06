import React, {ReactNode} from "react";

interface ButtonProps {
    onClick: () => void
    children?: ReactNode,
}

export const Button: React.FC<ButtonProps> = (props) => (
    <button
        style={{
            cursor: "pointer",
            borderRadius: '12px',
            border: 0,
            background: '#B9F4A4',
            alignItems: 'center',
            textAlign:'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
        }}
        onClick={props.onClick}>
        <p style={{
            fontWeight: '400',
            fontSize: '20px',
        }}>
            {props.children || 'Checkout'}
        </p>
    </button>
)
