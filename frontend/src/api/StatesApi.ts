import {backendClient} from "./index";

export const getStates = () => {
    return backendClient.get('/states')
        .then(r => r.data as string[])
}
