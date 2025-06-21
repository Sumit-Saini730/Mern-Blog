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
  Contact,
  CreatePost,
  UpdatePost
} from "./pages/index.js";
import { store, persistor } from './store/store.js'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import PrivateRoute from './components/PrivateRoute.jsx'
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute.jsx"
import PostPage from './components/PostPage.jsx'
import Search from './components/Search.jsx'




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='/search' element={<Search />} />
      <Route element={<PrivateRoute />}>
        <Route path='dashboard' element={<Dashboard />} />
      </Route>
      <Route element={<OnlyAdminPrivateRoute />}>
        <Route path='create-post' element={<CreatePost />} />
        <Route path='update-post/:postId' element={<UpdatePost />} />
      </Route>
      <Route path='projects' element={<Projects />} />
      <Route path='post/:postSlug' element={<PostPage />} />
      {/* <Route path='contact' element={<Contact />} /> */}
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </Provider>
    </PersistGate>
  
)
