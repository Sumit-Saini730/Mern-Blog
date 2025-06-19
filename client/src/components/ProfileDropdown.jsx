import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { signoutSuccess } from '../features/user/userSlice'
import { Link } from 'react-router-dom'
import { LuLogOut } from "react-icons/lu";
import { FaTimes, FaUser } from "react-icons/fa";
import default_image from "../assets/default_image.jpg";

function ProfileDropdown() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      avatarRef.current &&
      !avatarRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignout = async () => {
    try {
      const response = await axios.post("api/v1/auth/signout");
      if (response.data.success === true) {
        dispatch(signoutSuccess());
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      {/* Profile Image Button */}
      <div
        ref={avatarRef}
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border border-gray-500"
      >
        {currentUser?.profilePicture ? (
          <img
            src={currentUser.profilePicture}
            alt="User_Profile"
            onError={(e) => (e.target.src = default_image)}
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="origin-top absolute top-[70px] right-3 w-72 rounded-xl bg-gray-50 border-2 border-gray-400 text-black shadow-lg transition-all duration-200"
        >
          <div className="before:content-[''] before:absolute before:-top-2 before:right-3 before:w-4 before:h-4 before:rotate-45 before:bg-gray-50 before:border-l-2 before:border-t-2 before:border-gray-400"></div>
          <div className="flex items-center gap-4 p-3">
            <span className="w-16 h-16 rounded-full overflow-hidden">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt="User_Profile"
                  onError={(e) => (e.target.src = default_image)}
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </span>
            <span>
              <h1 className="font-bold">{currentUser.fullName}</h1>
              <p className="text-xs">{currentUser.email}</p>
            </span>
          </div>
          <hr className="border rounded w-[95%] mx-auto" />
          <div>
            <Link
              onClick={() => setIsOpen(false)}
              to="/dashboard?tab=profile"
              className="flex items-center justify-center gap-4 p-2 duration-200 hover:bg-gray-200"
            >
              <FaUser className="text-2xl" />
              <span className="font-semibold hover:text-sky-500 duration-200 text-sm">Profile</span>
            </Link>
            <div
              onClick={() => {
                handleSignout();
                setIsOpen(false);
              }}
              className="flex items-center gap-4 p-2 justify-center duration-200 hover:bg-gray-200 cursor-pointer"
            >
              <LuLogOut className="text-2xl" />
              <span className="font-semibold hover:text-sky-500 duration-200 text-sm">Logout</span>
            </div>
            <div
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-2 justify-center duration-200 hover:bg-gray-200 cursor-pointer"
            >
              <FaTimes className="text-2xl" />
              <span className="font-semibold hover:text-sky-500 duration-200 text-sm">Close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
