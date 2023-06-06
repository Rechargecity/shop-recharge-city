import {createModel, init, Models, RematchDispatch, RematchRootState} from "@rematch/core";
import {ExtraModelsFromLoading} from '@rematch/loading'
import persistPlugin from "@rematch/persist";
import storage from 'redux-persist/lib/storage';

interface authStoreModel {
    isAuthenticated: boolean,
    login: string,
    password: string
}

const initialState = {isAuthenticated: false}
export const auth = createModel<RootModel>()({
    state: initialState as authStoreModel,
    reducers: {
        set(state, payload: authStoreModel) {
            return payload
        }
    },
    effects: (dispatch) => ({
        saveAuthInfo(payload: authStoreModel) {
            dispatch.auth.set(payload)
        },
        logout() {
            dispatch.auth.set(initialState as authStoreModel)
        },
    })
})

export interface RootModel extends Models<RootModel> {
    auth: typeof auth
}

export const models: RootModel = {auth}
export const store = init<RootModel, ExtraModelsFromLoading<RootModel>>({
    models,
    plugins: [persistPlugin({
        key: 'root',
        storage
    })]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
