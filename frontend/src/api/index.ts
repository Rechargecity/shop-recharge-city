import axios from "axios";
import {BASE_URL} from "../config";
import {store} from "../storage";

export * from './ProductsApi'
export * from './PayformApi'

export const backendClient = axios.create({
    baseURL: `${BASE_URL}/api`
});

backendClient.interceptors.request.use(config => {
    const auth = store.getState().auth!!;
    config.auth = {
        username: auth.login,
        password: auth.password
    }
    return config
})

backendClient.interceptors.response.use(res => {
    if (res.status === 401) store.dispatch.auth.logout()
    if (res.status === 403) {
        window.location.pathname = '/forbidden'
    }
    return res
})
