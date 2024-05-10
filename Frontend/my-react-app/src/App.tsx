import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './Pages/HomePage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import PrivateRoute from './Utils/PrivateRoute'
import AuthcontextProvider from './context/Authcontext'
import { Home } from 'react-feather'
import ForgottenPassword from './Pages/ForgottenPassword'
import React from 'react'
const LazyAbout = React.lazy(() => import("./Pages/AboutPage"))
const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthcontextProvider />}>
      <Route element={<Navbar />}>
        <Route path='/'element={<PrivateRoute/>}>
          <Route index element={<HomePage />} />
          <Route path='about' element={<React.Suspense fallback="Loading...">
            <LazyAbout />
          </React.Suspense>} />

        </Route>
      </Route>
      <Route path='login' element={<Login />}/>
      <Route path='register' element={<Register />}/>
      <Route path='reset_password' element={<ForgottenPassword />} />
    </Route>
  )
)
const App = () => {
  return (
    <RouterProvider router={routers} />
  )
}

export default App
