import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL
export interface JWTTokenType {
    access: string,
    refresh: string
}
let userAuthToken = localStorage.getItem("userAuthTokens")

const axiosInstance = axios.create({
    baseURL,
    timeout: 6000,
    headers: {
        Authorization: userAuthToken ? "JWTToken " + JSON.parse(userAuthToken)?.access : null,
        Accept: "application/json",
        "Content-type": "application/json"
    }
})
const refresh_token = userAuthToken ? JSON.parse(userAuthToken).refresh : null
const refresh_payload: JwtPayload | null = refresh_token ? JSON.parse(atob(refresh_token.split(".")[1])) : null

export interface JwtPayload {
    email?: string
    exp: number
    iat: number
    jti: string
    name?: string
    status?: string
    phone_number?: string
    token_type?: string
    user_id?: number
}

axiosInstance.interceptors.request.use(req => {
    let userTokens: JWTTokenType | null = userAuthToken ? JSON.parse(userAuthToken) : null
    if (userAuthToken && userTokens) {
        userTokens = userAuthToken ? JSON.parse(userAuthToken) : null
        req.headers.Authorization = "JWTToken " + JSON.parse(userAuthToken).access
    }
    if (userTokens) {
        const user: JwtPayload = jwtDecode(userTokens.access)
        const hasExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        axios.post(`${baseURL}/token/refresh/`, { refresh: refresh_token }).then(res => {
            if (res.status >= 200 && res.status < 300) {
                localStorage.setItem("userAuthTokens", JSON.stringify(res.data))
                axiosInstance.defaults.headers['Authorization'] = "JWTToken " + res.data.access
            }
        })
    }
    return req
})

axiosInstance.interceptors.response.use(async res => {
    return res
}, async (error) => {
    if (error instanceof AxiosError) {
        const originalReq = error.config
        if (typeof error.response === 'undefined') {
            alert("A server/network error occured. \n Looks like CORS might be the problem. \n Sorry about this we will get it fixed shortly")

            return Promise.reject(error)
        } if (error.response.status === 401 && originalReq?.url == baseURL + 'token/refresh/') {
            const redirectUrl = encodeURIComponent(window.location.pathname);
            <Navigate to={`/login/?redirect=${redirectUrl}`} />
            return Promise.reject(error)
        }
        if (error.response.data?.code === 'token_not_valid' && error.response.status == 401 && error.response.statusText === "Unauthorized") {
            if (refresh_token && refresh_payload) {
                const dayDiff = dayjs.unix(refresh_payload.exp).diff(dayjs()) < 1
                if (dayDiff) {
                    return axiosInstance.post("/token/refresh/", { refresh: refresh_token }).then(res => {
                        if (res.status >= 200 && res.status < 300) {
                            localStorage.setItem("userAuthTokens", JSON.stringify(res.data))
                            axiosInstance.defaults.headers['Authorization'] = "JWTToken " + res.data.access
                            if (originalReq?.headers.Authorization) {
                                originalReq.headers.Authorization = "JWTToken " + res.data.access
                            }
                        }
                    }).catch((error) => {
                        if (error instanceof AxiosError) {
                            if (error.response?.status == 401) {
                                alert("Unauthorized Access")
                            }
                        }
                    })
                } else {
                    const redirectUrl = encodeURIComponent(window.location.pathname);
                    window.location.href = `/login/${redirectUrl}`
                    return <Navigate to="/login"/>
                }
            }
        }
        return Promise.reject(error)
    }
})
export default axiosInstance