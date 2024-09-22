import React from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import Container from '../components/Container'
function SignUp() {

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
          <form >
            <div className='flex flex-col gap-y-1'>
              <Input 
              label="Full Name*"
              />

              <Input 
              label="Username*"
              />

              <Input 
              label="Email*"
              type="email"
              />

              <Input 
              label="Password*"
              type="password"
              />
            </div>

            <button type='submit' className='my-4 w-full py-3 text-white rounded-xl font-bold bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 border-2 active:bg-sky-700 duration-200'>
              Sign Up
            </button>
          </form>
          <div className='text-center font-semibold'>
            <span>Already have an account? </span>
            <Link to="/sign-in" className='text-sky-500 hover:underline'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp