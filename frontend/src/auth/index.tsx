import React, {ReactNode} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../storage";
import {Navigate} from "react-router-dom";

interface ProtectedProps {
    children: ReactNode,
    redirectTo: string,
    admin?: boolean
}

export const Protected: React.FC<ProtectedProps> = (props) => {

    const auth = useSelector((state: RootState) => state.auth);

    if (!auth?.isAuthenticated) {
        return (<Navigate to={`/login?redirect-to=${props.redirectTo}`}/>)
    }

    if (props.admin && auth.login !== 'admin') {
        return (<Navigate to={`/forbidden`}/>)
    }

    return (<>{props.children}</>)
}
