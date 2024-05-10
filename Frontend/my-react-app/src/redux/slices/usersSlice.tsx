import { createSlice } from "@reduxjs/toolkit"

export interface UserDetailType {
    user_id: number | null
    name: string
    email: string
    phone_number: string
    status: "isStaff" | "isAdmin" | "isAnonymous"
}
export interface UserStatus {
    details: UserDetailType
    loggedIn: boolean
}
const initialState: UserStatus = {
    details: { user_id: null, name: "", email: "", phone_number: "", status: "isAnonymous"},
    loggedIn: false
}

const usersSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        
    }
})