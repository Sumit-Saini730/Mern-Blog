import React, { useState } from 'react'
import { useSelector } from "react-redux"
import Input from './Input'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function DashboardProfile() {

  const { currentUser } = useSelector((state) => state.user)

  const [showPassword, setShowPassword] = useState(false)
  const [update, setUpdate] = useState(false)
  const [isSure, setIsSure] = useState(false)

  const toggleIsSure = () => {
    setIsSure(!isSure)
  }

  const toggleUpdate = () => {
    setUpdate(!update)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const submit = (e) => {
    e.preventDefault()
  }

  return (
    <div className='flex flex-col h-screen mt-8 p-6 sm:w-2/5 mx-auto'>
      <h1 className='text-3xl text-center font-bold mb-5'>Profile</h1>

      <form onSubmit={submit}>
        <div className='w-44 h-44 cursor-pointer shadow-md rounded-full mx-auto'>
          <img className='w-full h-full border-8 rounded-full border-gray-300 object-cover' src={currentUser.profilePicture} alt="user" />
        </div>

        <div className='flex flex-col gap-y-3 mt-5'>
          <div>
            <Input
              type="text"
              label="Username"
              value={currentUser.username}
              disabled={true}
            />
          </div>

          <div>
            <Input
              type="text"
              label="Email"
              value={currentUser.email}
              disabled={true}
            />
          </div>

          <div className='relative'>
            <Input
              type="password"
              label="Password"
              disabled={true}
              placeholder="password"
            />

            <span
              className={`text-2xl absolute right-6 text-black top-[38px] cursor-pointer duration-100 hover:text-sky-500`}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {update ? (
            <div className='flex justify-between items-center'>
              <button
                className='p-3 px-6 text-red-500 text-lg font-semibold text-center border-2 border-red-500 hover:bg-red-200 rounded-xl bg-red-100 duration-200'
                onClick={toggleUpdate}
              >
                Cancel
              </button>

              <button
                className='p-3 px-6 mt-5 text-white rounded-lg text-lg font-semibold bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 border-2 active:bg-sky-700 duration-200'
              >
                Submit
              </button>
            </div>
          ) : (
            <button
              className='my-4 w-full py-3 text-white rounded-xl font-bold bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 border-2 active:bg-sky-700 duration-200'
              onClick={toggleUpdate}
            >
              Update
            </button>
          )}

          <div>
            <button
              type='button'
              onClick={toggleIsSure}
              className='my-4 w-full py-3 text-white rounded-xl font-bold bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 border-2 active:bg-red-700 duration-200'

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
      </form>
    </div>
  )
}

export default DashboardProfile