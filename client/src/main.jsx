import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import {
  About,
  Dashboard,
  Home,
  Projects,
  SignIn,
  SignUp,
  Contact
} from "./pages/index.js";
import { store, persistor } from './store/store.js'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import PrivateRoute from './components/PrivateRoute.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route element={<PrivateRoute />}>
        <Route path='dashboard' element={<Dashboard />} />
      </Route>
      <Route path='projects' element={<Projects />} />
      <Route path='contact' element={<Contact />} />
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </PersistGate>
  </StrictMode>,
)
