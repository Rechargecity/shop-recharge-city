import React, {ReactNode} from "react";
import {useMediaQuery} from "@mui/material";

interface Props {
    children: ReactNode
}

export const AdaptiveHeaderText: React.FC<Props> = (props) => {

    const matches = useMediaQuery('(min-width: 768px)')

    return matches
        ? (<h1>
            {props.children}
        </h1>)
        : (<h2>
            {props.children}
        </h2>)
}
