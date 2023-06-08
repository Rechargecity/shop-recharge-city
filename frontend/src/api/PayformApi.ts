import {backendSecureClient} from "./index";

interface GetUserResponseDto {
    id: string
    isFundingAttached: boolean
}

export const checkUser = async () => {
    return await backendSecureClient.get('/payform/check-user')
        .then(r => r.data as boolean)
}

export const getUser = async (
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    city: string,
    state: string,
    postalCode: string,
    dateOfBirth: string,
    ssn: string,
) => {
    return await backendSecureClient.get('/payform/user', {
        params: {
            'first-name': firstName,
            'last-name': lastName,
            email: email,
            address: lastName,
            city: city,
            state: state,
            'postal-code': postalCode,
            'date-of-birth': dateOfBirth,
            ssn: ssn,
        }
    }).then(r => r.data as GetUserResponseDto)
}
export const getLinkToken = async (userId: string) => {
    return await backendSecureClient.get('/payform/link-token', {
        params: {
            'user-id': userId
        }
    }).then(r => r.data as string)
}
export const processNotAttached = async (userId: string, token: string, accountId: string, productId: string) => {
    return await backendSecureClient.post(`/payform/process-not-attached/${productId}`, {
        userId: userId,
        publicToken: token,
        accountId: accountId,
    }).then(r => r.data as string)
}
export const processAttached = async (productId: string) => {
    return await backendSecureClient.post(`/payform/process-attached/${productId}`,).then(r => r.data as string)
}
