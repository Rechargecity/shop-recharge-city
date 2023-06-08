import React, {useState} from "react";
import {Header} from "../../component/header";
import {Link, TextField} from "@mui/material";
import {Button} from "../../component/button";
import {Dispatch, RootState} from "../../storage";
import {useDispatch, useSelector} from "react-redux";
import {Navigate, useSearchParams} from "react-router-dom";
import {checkCredentials} from "../../api/UsersApi";

export const Login = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch<Dispatch>()

    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect-to") || '/'
    const auth = useSelector((state: RootState) => state.auth);

    return !auth?.isAuthenticated ? (
        <div style={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Header/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h1>Welcome</h1>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <TextField
                        id="login"
                        label="Login"
                        value={login}
                        onChange={it => setLogin(it.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={it => setPassword(it.target.value)}
                    />
                    <Button
                        disabled={false}
                        onClick={() => {
                            dispatch.auth.saveAuthInfo({
                                isAuthenticated: false,
                                login: login,
                                password: password
                            })
                            checkCredentials().then(r => {
                                dispatch.auth.saveAuthInfo({
                                    isAuthenticated: r,
                                    login: login,
                                    password: password
                                })
                            }).catch(dispatch.auth.logout)
                        }}>
                        Login
                    </Button>
                    <Link href={`/register?redirect-to=${redirectTo}`}>Sign up</Link>
                </div>
            </div>
        </div>
    ) : (<Navigate to={redirectTo}/>)
}
