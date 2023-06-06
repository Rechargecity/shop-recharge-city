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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/forbidden",
        element: <Forbidden/>
    },
    {
        path: "/payment/:id",
        element: <Protected redirectTo={'/admin'}><Payment/></Protected>
    },
    {
        path: "/admin",
        element: <Protected redirectTo={'/admin'}><Admin/></Protected>
    },
]);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
