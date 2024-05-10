import React, { ChangeEvent, FormEventHandler, useContext, useState } from 'react'
import VerticalDivider from '../Components/VerticalDivider'
import { Link, useNavigate } from 'react-router-dom'
import ButtonLoadingIcon from '../Utils/loadingIcon'
import axiosInstance, { JWTTokenType } from '../Api/base'
import { AxiosError } from 'axios'
import { ContextType, InitialLoginType } from '../context/Authcontext'
import { Authcontext } from '../context/Authcontext'


const Login = () => {
  const initialLoginDetails: InitialLoginType = { email: "", password: "" };

  const [loginDetails, setLoginDetails] = useState<InitialLoginType>(initialLoginDetails);
  const ableTo = Boolean(loginDetails.email.trim() && loginDetails.password.trim());
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {

    switch (e.target.name) {
      case "email_input":
        setLoginDetails({ ...loginDetails, email: e.target.value });
        break;
      case "password_input":
        setLoginDetails({ ...loginDetails, password: e.target.value });
        break;
    }
  };
  const {loginUser, loginState} = useContext(Authcontext) as ContextType
  const handleFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    loginUser({ e, data: loginDetails })
    if(loginState.idle){
      setLoginDetails(initialLoginDetails)
    }
  }
  return (
    <div>
      <div className="login mx-auto">
        <div className=" lg:md:container relative shadow-md rounded-sm overflow-auto bg-stone-100 mx-auto my-6">
          <div className="grid h-full gap-x-8 grid-flow-row grid-cols-3">
            <div className='col-span-1 overflow-hidden self-stretch'>
              <img loading='lazy' className='bg-fixed bg-cover bg-center w-full h-full object-cover' src="assets/images/3d-rendering-cartoon-like-business-man.jpg" alt="" />
            </div>
            <div className='col-span-2 py-8 px-6'>
              <h4 className='font-semibold text-black text-3xl text-center'>Website</h4>
              <h3 className='font-medium text-black text-xl text-center'>Login Page</h3>
              <form method='post' onSubmit={handleFormSubmit} className='md:mt-8 flex flex-col space-y-3 sm:mt-3 lg:mt-7 xl: mt-8'>
                <div className='flex flex-col'>
                  <label htmlFor='email_input' id='emailLabel' className='font-semibold'>Email</label>
                  <input value={loginDetails.email} onChange={handleInputChange} required placeholder='Email' className='font-light form-control form-control-medium' type='email' name="email_input" id="email" />
                  {loginState.error_has_occurred && typeof loginState.error_message == 'object' && loginState.error_message.email && <ul className='list-disc'>{loginState.error_message.email.map(d => <li key={d} className='text-red-600  text-xs mb-1 font-light'>{d}</li>)}</ul>}
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='password_input' className='font-semibold' id='passwordLabel'>Password</label>
                  <input autoComplete='password-input' value={loginDetails.password} onChange={handleInputChange} required placeholder='Password' className='font-light form-control form-control-medium' type="password" name="password_input" id="passwordInput" />
                  {loginState.error_has_occurred && typeof loginState.error_message == 'object' && loginState.error_message.password && <ul className='list-disc'>{loginState.error_message.password.map(d => <li key={d} className='text-red-600  text-xs mb-1 font-light'>{d}</li>)}</ul>}
                </div>
                <div className='self-end'>
                  <Link to={"/reset_password"} className='text-blue-700 font-medium cursor-pointer text-sm'>Forgotten password ?</Link>
                </div>
                {loginState.error_has_occurred && typeof loginState.error_message === 'string' && <span className='text-red-600  text-sm mb-1 font-light'>{loginState.error_message}</span>}
                <button disabled={!ableTo} className={`${!ableTo ? 'btn-disabled' : "btn btn-primary-filled"} btn btn-large m-auto flex items-center gap-x-6 justify-center my-3 w-full`} type='submit'>{loginState.loading && <ButtonLoadingIcon />}Submit</button>
                <div>
                  <VerticalDivider text='Or' />
                </div>
                <div className='flex flex-col space-y-3'>
                  <a className='btn text-sm font-medium cursor-pointer w-full inline-flex items-center justify-center shadow-none rounded-full btn-gray-outlined'>
                    <img className='size-5 mr-2' src="assets/icons/google.png" alt="Google icon" />Sign in with Google</a>
                  <a className='btn text-sm font-medium cursor-pointer w-full inline-flex items-center justify-center shadow-none rounded-full btn-gray-outlined'>
                    <img className='size-5 mr-2' src="assets/icons/facebook (1).png" alt="facebook icon" />Sign up with facebook</a>
                </div>
                <label className='text-sm text-center mt-2'>You haven't joined us yet? <Link className='text-blue-700 underline font-medium' to="/register">Register</Link></label>
              </form>
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
export default Login