import { ChangeEvent, FormEventHandler, useState } from 'react'
import VerticalDivider from '../Components/VerticalDivider'
import { Link } from 'react-router-dom'
import axiosInstance from '../Api/base'
import { useNavigate } from "react-router-dom"
import axios, { AxiosError } from 'axios'
import ButtonLoadingIcon from '../Utils/loadingIcon'
import useAxios, { baseURL } from '../Utils/useAxios'

interface FormType {
    username: string,
    password: string
    confirm_password: string
    email: string,
    phone_number: string
}
interface FormStateType {
    idle: boolean,
    loading: boolean,
    success: boolean,
    error_occured: boolean,
    error_message?: string,
}
interface FieldsetsErrorType {
    username?: string[],
    password?: string[]
    confirm_password?: string[]
    email?: string[],
    phone_number?: string[]
    others?: string
}
const Register = () => {
    const initialData: FormType = Object.freeze({
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        phone_number: ''
    })
    let api = useAxios()
    const initialErrorMessage = Object.freeze({})
    const initialFormState: FormStateType = { idle: true, loading: false, error_occured: false, success: false, error_message: "" }
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormType>(initialData)
    const [formErrors, setFormErrors] = useState<FieldsetsErrorType>(initialErrorMessage)
    const [formState, setFormState] = useState<FormStateType>(initialFormState)
    const ableTo = Boolean(formData.confirm_password.trim() && formData.email.trim() && formData.password.trim() && formData.phone_number.trim() && formData.username.trim() && formState.idle)
    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case "username":
                setFormData({ ...formData, username: e.target.value })
                break
            case "email":
                setFormData({ ...formData, email: e.target.value })
                break
            case "phone_number":
                setFormData({ ...formData, phone_number: e.target.value })
                break
            case "password":
                setFormData({ ...formData, password: e.target.value })
                break
            case "confirm_password":
                setFormData({ ...formData, confirm_password: e.target.value })
                break
        }
    }
    const handleFormSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        setFormState({ loading: true, idle: false, success: false, error_occured: false, error_message: "" })
        axios.post(`${baseURL}auth/register/`, {
            username: formData.username.trim(),
            email: formData.email.trim(),
            phone_number: formData.phone_number.trim(),
            password: formData.password.trim(),
            confirm_password: formData.confirm_password.trim(),
        }).then(res => {
            if (res.status >= 200 && res.status < 300) {
                console.log(res, "Register")
                setFormErrors(initialErrorMessage)
                setFormState({ ...initialFormState, success: true })
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
            }
        }).finally(() => {
            setFormData(initialData)
            setFormState({ ...formState, idle:true, loading: false })
        })
        .catch((error) => {
                if (error instanceof AxiosError) {
                    console.log(error, "FFFFFFff errrss")
                    if (typeof error.response == "undefined" && error.message === "Network Error"){
                        setFormErrors({ others:"A server/network error occured. \n Looks like CORS might be the problem. \n Sorry about this we will get it fixed shortly"})
                        setFormState({ ...formState, success: false, error_occured: true, error_message: "Network Error" })
                    }
                    if (typeof error.response?.data == 'object') {
                        console.log(error.response?.data)
                        setFormErrors(error.response?.data)
                        setFormState({ ...formState,  success: false, error_occured: true, error_message: error.message })
                    }
                }
            })
    }
    return (
        <div>
            <div className="login mx-auto">
                <div className=" lg:md:container relative shadow-md rounded-sm overflow-auto bg-stone-100 mx-auto my-6">
                    <div className="grid h-full gap-x-8 grid-flow-row grid-cols-3">
                        <div className='col-span-1 self-stretch'>
                            <img loading='lazy' className='bg-fixed bg-cover bg-center grid-flow-row-dense w-full h-full grayscale object-cover' src="assets/images/nils-huenerfuerst-fMb3GCTUV6s-unsplash.jpg" alt="" />
                        </div>
                        <div className='col-span-2 py-8 px-6'>
                            <h4 className='font-semibold text-black text-3xl text-center'>Sign Up</h4>
                            <h3 className='font-medium text-black text-xl text-center'>Website</h3>
                            <form onSubmit={handleFormSubmit} method='post' className='md:mt-8 sm:mt-3 lg:mt-7 xl: mt-8'>
                                <div className='grid grid-cols-2 gap-x-2 gap-y-3'>
                                    <div className='flex flex-col self-stretch'>
                                        <label htmlFor='username' id='usernameLabel' className='font-semibold'>Username</label>
                                        <input value={formData.username} onChange={handleInputChanges} required placeholder='Username' className='font-light form-control form-control-medium' type="text" name="username" id="username" />

                                        {formState.error_occured && formErrors.username && <ul className='list-disc'>{formErrors.username.map(d => <li key={d} className='text-red-600  text-xs mb-1 font-light'>{d}</li>)}</ul>}
                                    </div>
                                    <div className='flex flex-col self-stretch'>
                                        <label htmlFor='email' id='emailLabel' className='font-semibold'>Email</label>
                                        <input value={formData.email} onChange={handleInputChanges} required placeholder='Email' className='font-light form-control form-control-medium' type="text" name="email" id="email" />
                                        {formState.error_occured && formErrors.email && <ul className='list-disc'>{formErrors.email.map(d => <li key={d} className='text-red-600 text-xs  mb-1 font-light'>{d}</li>)}</ul>}
                                    </div>
                                    <div className='flex flex-col col-span-2'>
                                        <label htmlFor='phone_number' id='phoneLabel' className='font-semibold'>Phone Number</label>
                                        <input value={formData.phone_number} onChange={handleInputChanges} required placeholder='Phone number' className='font-light form-control form-control-medium' type='tel' name="phone_number" id="phone_number" />
                                        {formState.error_occured && formErrors.phone_number && <ul className='list-disc'>{formErrors.phone_number.map(d => <li key={d} className='text-red-600  text-xs mb-1 font-light'>{d}</li>)}</ul>}

                                    </div>
                                    <div className='flex flex-col self-stretch'>
                                        <label htmlFor='password' className='font-semibold' id='passwordLabel'>Password</label>
                                        <input value={formData.password} onChange={handleInputChanges} required placeholder='Password' className='font-light form-control form-control-medium' type="password" name="password" id="password" />
                                        {formState.error_occured && formErrors.password && <ul className='list-disc'>{formErrors.password.map(d => <li key={d} className='text-red-600  text-xs mb-1 font-light'>{d}</li>)}</ul>}

                                    </div>
                                    <div className='flex flex-col self-stretch'>
                                        <label htmlFor='confirm_password' className='font-semibold' id='confirm_passwordLabel'>Confirm Password</label>
                                        <input value={formData.confirm_password} onChange={handleInputChanges} required placeholder='Confirm Password' className='font-light form-control form-control-medium' type="password" name="confirm_password" id="confirm_password" />
                                        {formState.error_occured && formErrors.confirm_password && <ul className='list-disc'>{formErrors.confirm_password.map(d => <li key={d} className='text-red-700  text-[14px] mb-1 font-light'>{d}</li>)}</ul>}
                                    </div>
                                </div>
                                {formErrors.others && <span className="text-red-700  text-[14px] mb-1 font-light">{formErrors.others}</span>}
                                <button className={`${!ableTo  ? 'btn-disabled' : "btn btn-primary-filled"} btn btn-large m-auto flex items-center gap-x-6 justify-center my-3 w-full`} type='submit'>{formState.loading && <ButtonLoadingIcon color='white' />}Submit</button>
                            </form>
                            <div>
                                <VerticalDivider text='Or' />
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <a className='btn text-sm font-medium cursor-pointer w-full inline-flex items-center justify-center shadow-none rounded-full btn-gray-outlined'>
                                    <img className='size-5 mr-2' src="assets/icons/google.png" alt="Google icon" />Sign up with Google</a>
                                <a className='btn text-sm font-medium cursor-pointer w-full inline-flex items-center justify-center shadow-none rounded-full btn-gray-outlined'>
                                    <img className='size-5 mr-2' src="assets/icons/facebook (1).png" alt="facebook icon" />Sign up with facebook</a>
                            </div>
                            <label className='text-sm w-full inline-flex justify-center text-center mt-2'>Are you one of us? <Link className='text-blue-700 underline font-medium ml-1' to="/login">Login</Link></label>
                        </div>
                    </div>
                </div>
                <div className='absolute top-0 right-0'>
                    <Link to='/' className='text-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='size-8 font-bold' height="20" viewBox="0 -960 960 960" width="20"><path d="M480-445.27 310.384-275.654q-8.307 8.307-16.769 7.75-8.461-.558-16.961-9.058-8.192-8.5-8.038-17.115.154-8.615 8.346-16.807L445.27-480 275.962-650.116q-7.808-7.807-7.5-16.615.308-8.807 8.5-17.307 8.192-8.5 16.961-8.75 8.769-.25 17.461 8.25L480-514.73l169.808-169.808q8.115-8.115 17.077-8.058 8.961.058 17.653 8.558 8 8.5 7.846 17.115-.154 8.615-8.346 16.807L514.73-480l169.308 170.116q7.808 7.807 8 16.115.192 8.307-8 16.807-8.192 8.5-16.961 8.75-8.769.25-17.269-8.442L480-445.27Z" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Register
