import axios, { AxiosError } from 'axios'
import React, { FormEventHandler, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InitialFormStateType } from '../context/Authcontext'

interface ForgottenPasswordType extends InitialFormStateType {
    success_message: string
}
const initialFormState: InitialFormStateType = Object.freeze({ idle: true, loading: false, success: false, error_has_occurred: false, error_message: "" })
const initialForgottenFormState: ForgottenPasswordType = { ...initialFormState, success_message: "" }
const ForgottenPassword = () => {
    const [email, setEmail] = useState("")
    const [formMessage, setFormMessage] = useState<ForgottenPasswordType>(initialForgottenFormState)
    let navigate = useNavigate()
    console.log(process.env, process.env.REACT_APP_BACKEND_URL)

    const requestToken: FormEventHandler = (e) => {
        e.preventDefault()
        setFormMessage({ ...initialFormState, success_message: "", loading: true, idle: false })
        axios.post(`${process.env.REACT_APP_BACKEND_URL as string}/api/auth/request-reset-email`, {
            email: email.trim()
        }).then((res) => {
            if (res.status == 200) {
                setFormMessage({ ...initialFormState, success: true, success_message: res.data.success, loading: false, idle: true })
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        }).catch((error) => {
            if (error instanceof AxiosError) {
                if (error.response?.data && typeof error.response.data === "object") {
                    if (error.response?.data.error) {
                        console.log("ERROR", error.response?.data.error)
                        setFormMessage({ ...initialFormState, error_has_occurred: true, loading: false, idle: true, success_message: "", error_message: error.response.data.error[0] })
                    }
                    else {
                        let error_msg = Object.keys(error.response.data)
                        setFormMessage({ ...initialFormState, error_has_occurred: true, loading: false, idle: true, success_message: "", error_message: error.response.data[error_msg[0]][0] })
                    }

                }else{
                    setFormMessage({ ...initialFormState, loading: false, idle: true, error_has_occurred: true, success_message: "", error_message: "An error has occured, please try again later" })
                }

            }
        })
    }
    return (
        <div className='h-[100vh] container mx-auto relative bg-gray-50/10  w-full'>
            <div className=' mx-auto py-7 mt-[2vh]  md:w-3/4 sm:w-full xs:w-full lg:w-3/4 xl:w-3/4'>
                <a className='text-2xl text-left pl-2 font-semibold'>Website</a>
                <div className="w-3/4 flex flex-col items-center space-y-8 justify-center mx-auto">
                    <div className='gap-y-4 text-center flex flex-col items-center'>
                        <div className='avatar relative flex animate-ring-light items-center text-white justify-center text-center bg-blue-800 ring-4 ring-blue-400/30 size-16 text-xl mx-auto my-9 rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" className=' fill-white'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                        <header className='font-bold text-2xl'>Forgot password ?</header>
                        <p className='text-sm font-normal'>
                            Enter an email associated with your account and we'll send an email with instructions to reset your password.
                        </p>
                    </div>
                    <div className='w-full'>
                        {formMessage.success && <span className='success-message text-green-600 font-normal text-md'>{formMessage.success_message}</span>}
                        <form onSubmit={requestToken} method='post' className='flex flex-col gap-y-5 '>
                            <div className='flex flex-col items-baseline w-full gap-x-4'>
                                <label className='font-semibold' htmlFor="reset_password_email">Email</label>
                                <div className='inline-flex relative w-full items-center gap-x-4'>
                                    <input onChange={(e) => setEmail(e.target.value)} required value={email} placeholder='Type in your email' className='form-control-medium pe-4 px-8 ps-12 relative form-control w-full text-base' type="email" name="reset_password_email" id="" />
                                    <svg className='absolute cursor-default fill-zinc-600 ml-3' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V8l6.94 4.34c.65.41 1.47.41 2.12 0L20 8v9c0 .55-.45 1-1 1zm-7-7L4 6h16l-8 5z" /></svg>
                                </div>
                                {formMessage.error_has_occurred && typeof formMessage.error_message == "string" && <div className='error-reset-password font-normal text-sm text-red-500'>
                                    <span>{formMessage.error_message}</span></div> || formMessage.error_has_occurred && <span>An error has occured please try again</span> }

                            </div>
                            <button disabled={!formMessage.idle && formMessage.loading} className={` ${!formMessage.idle && formMessage.loading && "btn-disabled"} mx-auto w-full py-4 rounded-full btn btn-dark`}>Reset Password</button>
                        </form>
                        <Link to='/' className='mx-auto flex flex-row items-center justify-center my-3 active:bg-slate-100 w-full transition-all ease-in-out px-2 gap-x-4 rounded-full py-3 '>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg>
                            Back to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgottenPassword
