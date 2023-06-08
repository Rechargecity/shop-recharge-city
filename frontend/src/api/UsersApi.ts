import {backendClient, backendSecureClient} from "./index";

export const checkCredentials = async () => {
    return await backendSecureClient.get('/users/check')
        .then(r => r.data as boolean)
}

export const register = async (username: string, password: string) => {
    return await backendClient.post('/users', {
        username: username,
        password: password
    })
}
