import React, {ReactNode} from "react";
import {Button as MUIButton} from "@mui/material";

interface ButtonProps {
    disabled: boolean
    onClick: () => void
    children?: ReactNode,
}

export const Button: React.FC<ButtonProps> = (props) => (
    <MUIButton
        sx={{
            height: '64px',
            borderRadius: '15px'
        }}
        fullWidth={true}
        disabled={props.disabled}
        variant={'contained'}
        color={'success'}
        onClick={props.onClick}>
        <p style={{
            fontWeight: '400',
            fontSize: '20px',
        }}>
            {props.children || 'Checkout'}
        </p>
    </MUIButton>
)
