import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Admin} from "./view/admin";
import {Payment} from "./view/payment";
import {store} from "./storage";
import {Provider} from "react-redux";
import {Protected} from "./auth";
import {Login} from "./view/login";
import {Forbidden} from "./view/forbidden";
import {Register} from "./view/register";
import {createTheme, ThemeProvider} from "@mui/material";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const theme = createTheme({
    palette: {
        success: {
            main: '#B9F4A4'
        }
    }
})


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/forbidden",
        element: <Forbidden/>
    },
    {
        path: "/payment/:id",
        element: <Protected redirectTo={window.location.pathname}><Payment/></Protected>
    },
    {
        path: "/admin",
        element: <Protected admin={true} redirectTo={'/admin'}><Admin/></Protected>
    },
]);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <RouterProvider router={router}/>
            </Provider>
        </ThemeProvider>

    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
