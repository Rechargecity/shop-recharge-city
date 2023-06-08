import {backendSecureClient} from "./index";

export interface Product {
    id?: string,
    name: string,
    description: string,
    price: string,
    isRecurring: boolean,

}

export const getProduct = async (id: string) => {
    return await backendSecureClient.get(`/products/${id}`)
        .then(r => r.data as Product)
}
export const createProduct = async (product: Product) => {
    return await backendSecureClient.post('/products', product)
        .then(r => r.data as Product)
}

export const editProduct = async (product: Product) => {
    return await backendSecureClient.put('/products', product)
        .then(r => r.data as Product)
}

export const deleteProduct = async (id: string) => {
    await backendSecureClient.delete(`/products/${id}`)
}

export const getProducts = async (page: number, size: number) => {

    return await backendSecureClient.get('/products', {
        params: {
            page: page,
            size: size
        }
    }).then(r => r.data.items as Product[])
}
