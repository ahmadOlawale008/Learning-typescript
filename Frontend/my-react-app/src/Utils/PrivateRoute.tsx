import React, { ReactElement, ReactNode, useContext, useEffect } from 'react'
import { Navigate, Outlet, Route, RouteProps, RouterProps } from 'react-router-dom'
import AuthcontextProvider, { Authcontext, ReducerActionEnum } from '../context/Authcontext'
import dayjs from 'dayjs'
import useAxios, { baseURL } from './useAxios'
import axios from 'axios'

const PrivateRoute: React.FC<RouteProps> = () => {
    const context = useContext(Authcontext)
    const api = useAxios()
    const checkIsAuthenticated = async () => {
        let token = localStorage.getItem("userAuthTokens") ? JSON.parse(localStorage.getItem("userAuthTokens") as string) : null;
        if (token) {
            let accessTokenDiff =  dayjs.unix(token.access).diff(dayjs()) < 1;
            let refreshTokenDiff = dayjs.unix(token.refresh).diff(dayjs()) < 1;
            if (accessTokenDiff && refreshTokenDiff) {
                alert("I am logging out A");
                context?.logoutUser();
            }
            if (accessTokenDiff && !refreshTokenDiff) {
                try {
                    const response = await axios.post(`${baseURL}token/refresh/`, {
                        refresh_token: token.refresh
                    });
                    if (response.status === 200) {
                        localStorage.setItem("userAuthTokens", JSON.stringify(response.data));
                        api.defaults.headers['Authorization'] = "JWTToken " + response.data.access;
                        context?.dispatch({ type: ReducerActionEnum.SET_LOGIN_STATE_SUCCESS, payload: response.data });
                    } else {
                        alert("I am logging out B");
                        context?.logoutUser();
                        return Promise.reject(new Error("Error whilst fetching refresh tokens"))
                    }
                } catch (error) {
                    alert("I am logging out C");
                    context?.logoutUser();
                    return Promise.reject(error);
                }
            }
        } else {
            context?.logoutUser();
        }
    };

    console.log(context?.token, localStorage.getItem("userAuthTokens"))
    useEffect(() => {
        checkIsAuthenticated();
    }, [])    
    return context && !context.isLoggedIn ? <Navigate to={'/login'} replace /> : <Outlet />
}

export default PrivateRoute;
