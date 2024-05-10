import React, { useContext } from 'react'
import { JWTTokenType, JwtPayload } from '../Api/base'
import { Authcontext, ReducerActionEnum } from '../context/Authcontext'
import { jwtDecode } from 'jwt-decode'
import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { Navigate, useLocation } from 'react-router-dom'
import { error } from 'console'

let userAuthToken = localStorage.getItem("userAuthTokens")
export const baseURL = "http://127.0.0.1:8000/api/"
const useAxios = () => {
    const context = useContext(Authcontext)
    const params = useLocation()
    console.log(encodeURIComponent(params.pathname))
    let axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: localStorage.getItem("userAuthTokens") ? "JWTToken " + JSON.parse(localStorage.getItem("userAuthTokens") as string).access : null,
            "Content-Type": "application/json"
        }
    })
    if (context) {
        let { token, dispatch, user, refreshExpired, logoutUser } = context
        axiosInstance = axios.create({
            baseURL,
            headers: {
                Authorization: "JWTToken " + token?.access,
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        })
        axiosInstance.interceptors.request.use(async (req) => {
            if (token && user) {
                if (refreshExpired) {
                    logoutUser()
                    return req
                }
                let dayDiff = dayjs.unix(user.exp).diff(dayjs()) < 1
                if (!dayDiff) return req
                try {
                    const response = await axios.post(`${baseURL}token/refresh/`, {
                        refresh: token.refresh
                    })
                    if (response.status == 200) {
                        localStorage.setItem("userAuthTokens", JSON.stringify(response.data))
                        req.headers.Authorization = "JWTToken " + response.data.access
                        dispatch({ type: ReducerActionEnum.SET_LOGIN_STATE_SUCCESS, payload: response.data })
                        return req
                    }
                } catch (error) {
                    logoutUser()
                    return Promise.reject(error)
                }
            } else {
                return Promise.reject(new Error("User Not Authenticated"))
            }
            return req
        }, async (error) => {
            if (error instanceof AxiosError) {
                console.log("Request error", error)
                return Promise.reject(error)
            }
        })
        axiosInstance.interceptors.response.use(res => res, async (error) => {
            if (error instanceof AxiosError) {
                console.log("Response, errror", error, error.response)
                if (error.code === 'ERR_NETWORK' && error.message === 'Network Error' && typeof error.response == 'undefined') {
                    alert("A server/network error occured. \n Looks like CORS might be the problem. \n Sorry about this we will get it fixed shortly")
                    return Promise.reject(error)
                }
                return Promise.reject(error)
            }
        })
    }

    return axiosInstance
}

export default useAxios
