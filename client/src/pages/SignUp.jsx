import React, { useState } from 'react'
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import { useForm } from "react-hook-form"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function SignUp() {

  const { register, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }
  const Submit = async (data) => {
    // console.log(data)
    try {
      setError(null)

      const response = await axios.post("api/v1/users/signup", data);
      // console.log(response)
      // console.log(response.data.success)
      if (response.data.success === true) {
        // console.log("inside success")
        navigate("/sign-in")
      }
      
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;
        if (message) {
          // alert(message);
          setError(message);
        } else {
          alert("An unknown error occurred.");
          // setError("An unknown error occurred.");
        }
      } else if (error.request) {
        alert("No response from server. Please try again later.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex px-5 py-2 gap-x-12 max-w-5xl mx-auto flex-col md:flex-row md:items-center'>
        <div className='flex flex-col gap-y-5 flex-1 my-3'>
          <h2 className='text-5xl font-bold'>Welcome to</h2>

          <Link to="/"
            className='font-bold text-4xl'
          >
            <span className='px-4 py-2 bg-gradient-to-r from-[#ff234b] to-cyan-400 text-white rounded-lg'>INSPIRE</span>
            Hub
          </Link>
          <p className='text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint vero velit, sit possimus earum laudantium!</p>
        </div>

        <div className='flex-1'>
          <form onSubmit={handleSubmit(Submit)}>
            <div className='flex flex-col gap-y-1'>
              <div>
                <Input
                  label="Full Name*"
                  type="text"
                  {...register("fullName",
                    {
                      required: true,
                      minLength: { value: 3, message: "Full Name must be at least 3 characters" },
                      onBlur: (e) => setValue("fullName", e.target.value.trim()),
                    }
                  )}
                />

                {errors.fullName && <p className="text-red-500 font-semibold">{errors.fullName.message}</p>}
              </div>

              <div>
                <Input
                  label="Username*"
                  type="text"
                  {...register("username",
                    {
                      required: true,
                      minLength: { value: 3, message: "Username must be at least 3 characters" },
                      onBlur: (e) => setValue("username", e.target.value.trim()),
                    }
                  )}
                />

                {errors.username && <p className="text-red-500 font-semibold">{errors.username.message}</p>}
              </div>

              <div>
                <Input
                  label="Email*"
                  type="email"
                  {...register("email",
                    {
                      required: true,
                      validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                          "Email address must be a valid address",
                      },
                      onBlur: (e) => setValue("email", e.target.value.trim()),
                    }
                  )}
                />

                {errors.email && <p className="text-red-500 font-semibold">{errors.email.message}</p>}
              </div>

              <div className='relative'>
                <Input
                  id={"password"}
                  className="pr-16"
                  label="Password*"
                  type={showPassword ? "text" : "password"}
                  {...register("password",
                    {
                      required: true,
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                      onBlur: (e) => setValue("password", e.target.value.trim()),
                    }
                  )}
                />
                <span
                  className='text-2xl absolute right-6 top-[38px] cursor-pointer duration-100 hover:text-sky-500'
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>

                {errors.password && <p className="text-red-500 font-semibold">{errors.password.message}</p>}
              </div>
            </div>

            <button type='submit' className={` my-4 w-full py-3 text-white rounded-xl font-bold bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 border-2 active:bg-sky-700 duration-200 ${isSubmitting ? "disabled" : ""}`}>
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          </form>
          <div className='text-center font-semibold'>
            <span>Already have an account? </span>
            <Link to="/signin" className='text-sky-500 hover:underline'>Sign In</Link>
          </div>
          {error && <p className="text-red-500 text-lg font-semibold text-center border-2 border-red-500 rounded-xl py-2 bg-red-100">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignUp