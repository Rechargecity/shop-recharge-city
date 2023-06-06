import {store} from "../storage";
import {backendClient} from "./index";

export interface Product {
    id?: string,
    name: string,
    description: string,
    price: string,
    isRecurring: boolean,

}

export const getProduct = async (id: string) => {
    return await backendClient.get(`/products/${id}`)
        .then(r => r.data as Product)
}
export const createProduct = async (product: Product) => {
    return await backendClient.post('/products', product)
        .then(r => r.data as Product)
}

export const editProduct = async (product: Product) => {
    return await backendClient.put('/products', product)
        .then(r => r.data as Product)
}

export const deleteProduct = async (id: string) => {
    await backendClient.delete(`/products/${id}`)
}

export const getProducts = async (page: number, size: number) => {
    const auth = store.getState().auth!!;

    return await backendClient.get('/products', {
        auth: {
            username: auth.login,
            password: auth.password
        },
        params: {
            page: page,
            size: size
        }
    })
        .then(r => r.data.items as Product[])
}
