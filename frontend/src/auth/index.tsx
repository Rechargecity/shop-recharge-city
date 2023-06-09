import React, {ReactNode} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../storage";
import {Navigate} from "react-router-dom";

interface ProtectedProps {
    children: ReactNode,
}

export const Protected: React.FC<ProtectedProps> = (props) => {

    const auth = useSelector((state: RootState) => state.auth);

    const pathname = window.location.pathname;

    if (!auth?.isAuthenticated) {
        return (<Navigate to={`/register?redirect-to=${pathname}`}/>)
    }

    if (pathname.includes('admin') && auth.login !== 'admin') {
        return (<Navigate to={`/forbidden`}/>)
    }

    return (<>{props.children}</>)
}
