import React, {useState} from "react";
import {Header} from "../../component/header";
import {Link, TextField} from "@mui/material";
import {Button} from "../../component/button";
import {Dispatch, RootState} from "../../storage";
import {useDispatch, useSelector} from "react-redux";
import {Navigate, useSearchParams} from "react-router-dom";
import {register} from "../../api/UsersApi";

export const Register = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch<Dispatch>()
    const auth = useSelector((state: RootState) => state.auth);

    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect-to") || '/'

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
                <h1>Please, register to proceed to payment</h1>
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
                            register(login, password)
                                .then(() => dispatch.auth.saveAuthInfo({
                                    isAuthenticated: true,
                                    login: login,
                                    password: password
                                }))
                                .catch(e => {
                                    alert(e)
                                })
                        }}>
                        Register
                    </Button>
                    <Link href={`/login?redirect-to=${redirectTo}`}>Login</Link>
                </div>
            </div>
        </div>
    ) : (<Navigate to={redirectTo}/>)
}
