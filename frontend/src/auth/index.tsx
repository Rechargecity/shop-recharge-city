import React, {ReactNode} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../storage";
import {Navigate} from "react-router-dom";

interface ProtectedProps {
    children: ReactNode,
    redirectTo: string
}

export const Protected: React.FC<ProtectedProps> = (props) => {

    const auth = useSelector((state: RootState) => state.auth);

    return auth?.isAuthenticated ? (<>{props.children}</>) : (<Navigate to={`/login?redirect-to=${props.redirectTo}`}/>)
}
