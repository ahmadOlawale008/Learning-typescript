import { jwtDecode } from 'jwt-decode'
import { FormEvent, ReactNode, createContext, useReducer } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { JWTTokenType, JwtPayload } from '../Api/base'
import axios, { AxiosError } from 'axios';
import useAxios, { baseURL } from '../Utils/useAxios';

import dayjs from 'dayjs';
export enum ReducerActionEnum {
    SET_LOGOUT = "SET_LOGOUT",
    LOGIN = "LOGIN",
    SETTOKEN = "SETTOKEN",
    SETUSER = "SETUSER",
    SET_LOGIN_STATE_SUCCESS = "SET_LOGIN_STATE_SUCCESS",
    SET_LOGIN_STATE_LOADING = "SET_LOGIN_STATE_LOADING",
    SET_LOGIN_STATE_FINALLY = "SET_LOGIN_STATE_FINALLY",
    SET_LOGIN_STATE_ENCOUNTERED_ERROR = "SET_LOGIN_STATE_ENCOUNTERED_ERROR",
}
export interface ReducerActionType {
    type: ReducerActionEnum,
    payload?: JWTTokenType | AxiosError
}
export interface InitialErrorMessageType {
    email: string[];
    password: string[];
    detail?: string;
}
export interface InitialFormStateType {
    idle: boolean;
    loading: boolean;
    success: boolean;
    error_has_occurred: boolean;
    error_message: InitialErrorMessageType | string;
}
export interface InitialLoginType {
    email: string;
    password: string;
}
export interface UserDetailType {
    email?: string
    name?: string
    phone_number?: string
    user_id?: number
    status?: "isStaff" | "isAdmin" | "isAnonymous"
}
export interface ContextType {
    isLoggedIn: boolean,
    loginUser: ({ e, data }: { e: FormEvent, data: InitialLoginType }) => void,
    logoutUser: () => void,
    loginState: InitialFormStateType,
    token: JWTTokenType | null,
    user: JwtPayload | null
    refreshExpired: boolean
    dispatch: React.Dispatch<ReducerActionType>
}
export interface TokenType {
    access: string,
    refresh: string
}
export interface ContextTypeB {
    isLoggedIn: boolean,
    loginState: InitialFormStateType,
    token: JWTTokenType | null,
    user: JwtPayload | null
}

const initialErrorMessage: InitialErrorMessageType = Object.freeze({ email: [], password: [] });
export const initialFormState: InitialFormStateType = Object.freeze({ idle: true, loading: false, success: false, error_has_occurred: false, error_message: initialErrorMessage });
const defaultState: ContextTypeB = {
    isLoggedIn: localStorage.getItem("userAuthTokens") ? true : false,
    loginState: initialFormState,
    token: localStorage.getItem("userAuthTokens") ? JSON.parse(localStorage.getItem("userAuthTokens") as string) : null,
    user: localStorage.getItem("userAuthTokens") && "access" in JSON.parse(localStorage.getItem("userAuthTokens") as string)
        ? jwtDecode(JSON.parse(localStorage.getItem("userAuthTokens") as string).access)
        : null,
}
const reducer = (state: ContextTypeB, action: ReducerActionType): ContextTypeB => {
    switch (action.type) {
        case ReducerActionEnum.SET_LOGIN_STATE_LOADING:
            return { ...state, loginState: { ...initialFormState, idle: false, loading: true } }
        
        case ReducerActionEnum.SET_LOGIN_STATE_FINALLY:
            return { ...state, loginState: { ...state.loginState, idle: true, loading: false } }
        
        case ReducerActionEnum.SET_LOGIN_STATE_ENCOUNTERED_ERROR:
            let defaultErrorState = { success: false, error_has_occurred: true, error_message: "Sorry an error has occured. This is likely from our side\n We will fix it as soon as possible" }
            if (action.payload instanceof AxiosError) {
                if (action.payload.response?.data && typeof action.payload.response.data === 'object') {
                    if ("detail" in action.payload.response.data && typeof action.payload.response.data.detail === 'string') {
                        return { ...state, isLoggedIn: false, loginState: { ...state.loginState, ...defaultErrorState, error_message: action.payload.response.data.detail } }
                    }
                }
            }
            return { ...state, isLoggedIn: false, loginState: { ...initialFormState, ...defaultErrorState } }
        
        case ReducerActionEnum.SET_LOGIN_STATE_SUCCESS:
            if (action.payload && "access" in action.payload && "refresh" in action.payload) {
                return { ...state, isLoggedIn: true, loginState: { ...state.loginState, success: true, error_has_occurred: false, error_message: initialErrorMessage }, token: action.payload, user: jwtDecode(action.payload.access) }
            }
            return { ...state }
        
        case ReducerActionEnum.SET_LOGOUT:
            return { token: null, user: null, loginState: initialFormState, isLoggedIn: false }

        case ReducerActionEnum.SETTOKEN:
            if (action.payload && "access" in action.payload) {
                return { ...state, token: action.payload, user: jwtDecode(action.payload.access) }
            }
            break
        
        default:
            return { ...state }
    }
    return state
}

export const Authcontext = createContext<ContextType | null>(null)

const AuthcontextProvider = ({ children }: { children?: ReactNode }) => {
    let api = useAxios()
    let navigate = useNavigate()
    const [state, dispatch] = useReducer(reducer, defaultState)
    let refreshExpired = state.token?.refresh ? dayjs.unix(jwtDecode(state.token.refresh).exp as number).diff(dayjs()) < 1 : false
    const loginUser = async ({ e, data }: { e: FormEvent, data: InitialLoginType }) => {
        dispatch({ type: ReducerActionEnum.SET_LOGIN_STATE_LOADING })
        api.post("/token/", {
            email: data.email.trim(),
            password: data.password.trim()
        }).then(res => {
            if (res.status === 200) {
                dispatch({ type: ReducerActionEnum.SET_LOGIN_STATE_SUCCESS, payload: res.data })
                localStorage.setItem("userAuthTokens", JSON.stringify(res.data))
                api.defaults.headers['Authorization'] = "JWTToken " + res.data.access
                navigate("/")
            }
        }).finally(() => {
            dispatch({ type: ReducerActionEnum.SET_LOGIN_STATE_FINALLY })
        }).catch((error) => {
            if (error instanceof AxiosError) {
                dispatch({ type: ReducerActionEnum.SET_LOGIN_STATE_ENCOUNTERED_ERROR, payload: error })
            }
        });
    };

    const logoutUser = () => {
        if (state.token?.refresh) {
            axios.post(`${baseURL}auth/logout/blacklist/`, {
                refresh_token: state.token.refresh
            }).then(res => {
                if (res.status === 200) {
                    dispatch({ type: ReducerActionEnum.SET_LOGOUT })
                    localStorage.removeItem("userAuthTokens");
                    api.defaults.headers['Authorization'] = null
                }
            }).catch(error => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 400 && error.response?.data.error == "Token is blacklisted" || error.response?.data.error == "Token is invalid or expired") {
                        dispatch({ type: ReducerActionEnum.SET_LOGOUT })
                        localStorage.removeItem("userAuthTokens");
                        api.defaults.headers['Authorization'] = null
                    }
                    console.log("Failed to logout", error)
                }
            })
        }
    }
    const contextData: ContextType = Object.freeze({
        user: state.user,
        loginUser,
        logoutUser,
        isLoggedIn: state.isLoggedIn,
        loginState: state.loginState,
        token: state.token,
        dispatch,
        refreshExpired
    }
    )
    return (
        <Authcontext.Provider value={contextData}>
            <Outlet />
        </Authcontext.Provider>
    )
}
export default AuthcontextProvider