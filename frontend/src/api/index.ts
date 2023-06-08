import axios from "axios";
import {BASE_URL} from "../config";
import {store} from "../storage";

export * from './ProductsApi'
export * from './PayformApi'

export const backendClient = axios.create({
    baseURL: `${BASE_URL}/api`
});

export const backendSecureClient = axios.create({
    baseURL: `${BASE_URL}/api`
});

backendSecureClient.interceptors.request.use(config => {
    const auth = store.getState().auth!!;
    config.auth = {
        username: auth.login,
        password: auth.password
    }
    return config
})
