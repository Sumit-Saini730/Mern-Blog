import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LuLogOut } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import default_image from "../assets/default_image.jpg";

function ProfileDropdown() {
  const { currentUser } = useSelector((state) => state.user)
  console.log(currentUser.profilePicture)
  const [isOpen, setIsOpen] = useState(false) // for profile menu
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div>
      <div onClick={(toggleMenu)} className='w-10 h-10 rounded-full overflow-hidden cursor-pointer'>
        {currentUser?.profilePicture ? (
          <img src={currentUser.profilePicture} alt="User_Profile" onError={(e) => e.target.src = default_image} />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>

      <div ref={dropdownRef} className={`${isOpen ? "scale-y-100" : "scale-y-0"} origin-top before:content-[''] before:absolute before:-top-2 before:right-3 before:w-4 before:h-4 before:rotate-45 before:bg-gray-50 before:border-l-2 before:border-t-2 before:border-gray-400 transition-all ease-in-out duration-200 absolute top-14 right-1 w-72 rounded-xl bg-gray-50 border-2 border-gray-400 text-black`}>
        <div>
          <div className='flex items-center gap-4 p-3'>
            <span className='w-16 h-16 rounded-full overflow-hidden'>
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="User_Profile" />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </span>
            <span>
              <h1 className='font-bold'>{currentUser.fullName}</h1>
              <p className='text-xs'>{currentUser.email}</p>
            </span>
          </div>
          <hr className='border rounded w-[95%] mx-auto' />

          <div>
            <Link onClick={toggleMenu} to="/dashboard?tab=profile" className='flex items-center justify-center gap-4 p-2 duration-200 hover:bg-gray-200'>
              <FaUser className='text-2xl' />
              <span className='font-semibold hover:text-sky-500 duration-200 text-sm'>Profile</span>
            </Link>
            <Link onClick={toggleMenu} to="#" className='flex items-center gap-4 p-2 justify-center duration-200 hover:bg-gray-200'>
              <LuLogOut className='text-2xl' />
              <span className='font-semibold hover:text-sky-500 duration-200 text-sm'>Logout</span>
            </Link>
            <div onClick={toggleMenu} className='flex items-center gap-4 p-2 justify-center duration-200 hover:bg-gray-200'>
              <FaTimes className='text-2xl' />
              <span className='font-semibold hover:text-sky-500 duration-200 text-sm'>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDropdown