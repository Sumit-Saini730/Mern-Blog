import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LuLogOut } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

function ProfileDropdown() {
  const { currentUser } = useSelector((state) => state.user)
  // console.log(currentUser)
  const [isOpen, setIsOpen] = useState(false) // for profile menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
  return (
    <div>
      <div onClick={(toggleMenu)} className='w-10 h-10 rounded-full overflow-hidden cursor-pointer'>
        <img src={currentUser.profilePic} alt="User_Profile" />
      </div>

      <div className={`${isOpen ? "scale-y-100" : "scale-y-0"} origin-top before:content-[''] before:absolute before:-top-2 before:right-3 before:w-4 before:h-4 before:rotate-45 before:bg-gray-50 before:border-l-2 before:border-t-2 before:border-gray-400 transition-all ease-in-out duration-200 absolute top-[152px] right-4 w-72 rounded-lg bg-gray-50 border-2 border-gray-400 `}>
        <div>
          <div className='flex items-center gap-4 p-3'>
            <span className='w-16 h-16 rounded-full overflow-hidden'>
              <img src={currentUser.profilePic} alt="User_Profile" />
            </span>
            <span>
            <h1 className='font-bold'>{currentUser.fullName}</h1>
            <p className='text-xs'>{currentUser.email}</p>
            </span>
          </div>
          <hr className='border rounded w-[95%] mx-auto' />

          <div>
            <Link to="/dashboard?tab=profile" className='flex items-center justify-center gap-4 p-3 duration-200 hover:bg-gray-200'>
              <IoMdSettings className='text-2xl'/>
              <span className='font-semibold hover:text-sky-500 duration-200 text-sm'>Profile</span>
            </Link>
            <Link to="#" className='flex items-center gap-4 p-3 justify-center duration-200 hover:bg-gray-200'>
              <LuLogOut className='text-2xl'/>
              <span className='font-semibold hover:text-sky-500 duration-200 text-sm'>Logout</span>
            </Link>
            <div onClick={toggleMenu} className='flex items-center gap-4 p-3 justify-center duration-200 hover:bg-gray-200'>
              <FaTimes className='text-2xl'/>
              <span className='font-semibold hover:text-sky-500 duration-200 text-sm'>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDropdown