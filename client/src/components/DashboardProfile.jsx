import React, { useEffect, useState } from 'react'
import Input from './Input'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import default_image from "../assets/default_image.jpg";
import { useForm } from "react-hook-form";
import { updateStart, updateSuccess, updateFailure } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';


function DashboardProfile() {

  const { currentUser } = useSelector((state) => state.user)
  // console.log(currentUser)

  const [showPassword, setShowPassword] = useState(false)
  const [isSure, setIsSure] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileTempUrl, setImageFileTempUrl] = useState(null)
  // console.log(imageFile)

  const toggleIsSure = () => {
    setIsSure(!isSure)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleImageChange = (e) => {
    // console.log(e.target.files)
    const file = e.target.files[0];
    if (file) {
      setImageFile(file)
      setImageFileTempUrl(URL.createObjectURL(file))
    }
  }
  // console.log(imageFileTempUrl)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      username: currentUser.username
    }
  });
  const dispatch = useDispatch();
  const Submit = async (data) => {
    console.log("printing data...")
    console.log(data)
    try {
      dispatch(updateStart());

      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password || "");
      if(data.profilePicture && data.profilePicture.length > 0){
        formData.append("profilePicture", data.profilePicture[0]);
      }

      const response = await axios.patch(`api/v1/users/update/${currentUser._id}`, formData);
      console.log(response)
      console.log(response.data.success)

      if (response.data.success === true) {
        dispatch(updateSuccess(response.data.data.user));
      }

      if (response.data.success === false) {
        dispatch(updateFailure(response.data.message));
      }

    } catch (error) {
      console.log(error)
      if (error.response) {
        const message = error.response.data.message;
        if (message) {
          // alert(message);
          dispatch(updateFailure(message));
        } else {
          alert("An unknown error occurred.");
          // setError("An unknown error occurred.");
        }
      } else if (error.request) {
        // alert("No response from server. Please try again later.");
        dispatch(updateFailure("No response from server. Please try again later."));
      } else {
        // alert("An error occurred. Please try again.");
        dispatch(updateFailure("An error occurred. Please try again."));
      }
    }
  }

  return (
    <div className='flex flex-col h-screen mt-8 p-6 sm:p-0 sm:w-4/6 md:w-1/2 w-full mx-auto'>
      <h1 className='text-3xl text-center font-bold mb-5'>Profile</h1>

        <form onSubmit={handleSubmit(Submit)} encType='multipart/form-data'>
          <div className='w-44 h-44 cursor-pointer shadow-md rounded-full mx-auto mb-3 relative'>
            <img
              className={`w-full h-full border-2 rounded-full border-gray-300 object-cover cursor-default`}
              onError={(e) => e.target.src = default_image}
              src={imageFileTempUrl || currentUser.profilePicture}
              alt="user"
            />
            <div className={`absolute bottom-1`}>
              {!imageFileTempUrl ?
                (<label className={`border-2 p-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-pointer duration-200 font-semibold`}>
                  <input
                    type="file"
                    accept='image/*'
                    className='hidden'
                    {...register("profilePicture", {
                      onChange: handleImageChange,
                      validate: {
                        fileSize: (file) => {
                          if (!file || file.length === 0) return true
                          return file[0].size <= 2 * 1024 * 1024 || "Image size should be less than 2MB"
                        }
                      },
                    })}
                  />✎ Edit
                </label>)
                :
                null
              }
              {errors.profilePicture && <span className='text-red-500 text-sm'>{errors.profilePicture.message}</span>}
            </div>

          </div>

          <div className='flex flex-col gap-y-3 mt-5'>
            <div>
              <Input
                type="text"
                label="Username"
                {...register("username", {
                  required: true,
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                  onBlur: (e) => setValue("username", e.target.value.trim())
                })}
              />
              {errors.username && <span className='text-red-500 text-sm'>{errors.username.message}</span>}
            </div>

            <div>
              <Input
                type="text"
                label="Email"
                value={currentUser.email}
                disabled={true}
              />
            </div>

            {currentUser.authProvider === "local" && <div className='relative'>
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="password"
                {...register("password",
                  {
                    validate: (value) => {
                      !value || value.length >= 6 || "Password must be at least 6 characters"
                    },
                    onBlur: (e) => setValue("password", e.target.value.trim())
                  }
                )}
              />
              {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}

              <span
                className={`text-2xl absolute right-6 text-black top-[38px] cursor-pointer duration-100 hover:text-sky-500`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>}
          </div>

          <button
            type='submit'
            className={`my-10 w-full py-3 text-white rounded-xl font-bold bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 border-2 active:bg-sky-700 duration-200 ${isSubmitting ? "disabled" : ""}`}
          >
            {isSubmitting ? "loading..." : "Update"}
          </button>
        </form>
        

      {/* delete account */}
      <div>
        <button
          type='button'
          onClick={toggleIsSure}
          className='w-full py-3 text-white rounded-xl font-bold bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 border-2 active:bg-red-700 duration-200'

        >
          Delete Account
        </button>

        <div className={`${isSure ? "flex" : "hidden"} top-0 left-0 items-center justify-center fixed w-full h-full bg-transparent backdrop-blur-md`}>
          <div className='p-6 rounded-xl w-80 bg-white border-2 border-red-200'>
            <p className='text-lg font-semibold text-wrap text-black text-center'>Are you sure you want to delete your account?</p>
            <div className='flex justify-between'>
              <button
                onClick={toggleIsSure}
                className='p-3 px-6 mt-5 text-sky-500 text-lg font-semibold text-center border-2 border-sky-500 hover:bg-sky-200 rounded-xl bg-sky-100 duration-200'
              >
                No
              </button>

              <button
                className='p-3 px-6 mt-5 text-white rounded-lg text-lg font-semibold bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 border-2 active:bg-red-700 duration-200'
              >
                Yes
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardProfile