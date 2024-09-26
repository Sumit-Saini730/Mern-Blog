import React from 'react'
import googleLogo from "../assets/google.png"
import { app } from '../firebase'
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '../features/user/userSlice'

function OAuth() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleLogin = async () => {
        // console.log("google login")
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const googleResponse = await signInWithPopup(auth, provider);
            // console.log(googleResponse);
            const response = await axios.post("/api/v1/auth/google", {
                name: googleResponse.user.displayName,
                email: googleResponse.user.email,
                googlePhotoUrl: googleResponse.user.photoURL
            });

            if (response.data.success) {
                // console.log(response.data);
                dispatch(loginSuccess(response.data.data.user));
                navigate("/");
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <button
            type='button'
            className={` my-4 w-full py-2 rounded-xl font-bold border-2 border-gray-400 hover:shadow-lg active:scale-95 duration-200`}
            onClick={handleGoogleLogin}
        >
            <img className='inline-block mr-2 w-6 h-6' src={googleLogo} alt="google_image" />
            <span>Continue with Google</span>
        </button>
    )
}

export default OAuth