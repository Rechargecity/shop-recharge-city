import {Logo} from "../logo";
import React, {ReactNode} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch, RootState} from "../../storage";

interface HeaderProps {
    rightItem?: ReactNode
}

export const Header: React.FC<HeaderProps> = (props) => {

    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<Dispatch>();

    return (
        <header style={{
            padding: '30px',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Logo/>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '36px'
            }}>
                {props.rightItem}
                <h2
                    onClick={() => {
                        dispatch.auth.logout()
                        window.location.reload();
                    }}
                    style={{
                        cursor: 'pointer',
                        display: auth?.isAuthenticated ? 'block' : 'none'
                    }}>
                    Logout
                </h2>
            </div>
        </header>
    )
}
