import React, { useEffect, useState } from 'react'
import { IoMenu } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
function DashboradSidebar() {

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search])

  const { currentUser } = useSelector((state) => state.user)
  const [isAdmin, setIsAdmin] = useState(true)

  const [open, setOpen] = useState(true)
  const toggleMenu = () => {
    setOpen(!open)
  }
  return (
    <div className={`sm:h-full opacity-100 ${open ? "w-56" : "w-[75px]"} bg-gray-50 shadow-lg border-r-2 border-t-2 rounded-lg dark:bg-[#12171e] p-3 transition-all ease-in-out duration-300 text-black dark:text-white`}>

      <div className={`flex ${open ? "justify-between" : "justify-center"} items-center h-8`}>
        {/* <div className="text-sm font-bold whitespace-nowrap cursor-default">
            <span className='px-2 py-1 text-white bg-gradient-to-r from-[#ff234b] to-cyan-400 rounded-lg'>INSPIRE</span>
            Hub
          </div> */}
        <span className={`text-lg font-bold ${!open && "hidden"}`}>Menu</span>
        <button
          onClick={toggleMenu}
          className='text-lg hover:bg-gray-200 hover:dark:bg-sky-300 duration-200 p-2 rounded-lg'>{open ? <FaTimes /> : <IoMenu />}
        </button>
      </div>
      <hr className='border rounded w-[95%] mt-3 mx-auto' />

      <div className="user flex gap-x-5 h-10 items-center mt-3">

        <img className='w-12 h-12 rounded-full' src={currentUser.profilePicture} alt="User_Profile" />

        <div className={`mt-2 ${!open && "hidden"}`}>
          {isAdmin ? <h2 className={`font-bold text-center bg-gray-200 dark:bg-gray-700 rounded-lg`}>Admin</h2> : null}
          <p className='font-bold text-center whitespace-nowrap'>{currentUser.fullName}</p>
        </div>
      </div>

      <div className='mt-4'>
        <ul className='flex flex-col gap-y-3 p-1'>

          {/* <li className={`flex relative items-center h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-sky-300 p-3 duration-200`}>
            <NavLink
            to="/dashboard"
            className={({isActive}) => `${isActive ? "text-sky-500" : ""} flex items-center justify-center gap-9`}>
              <span className='text-lg'><MdDashboard /></span>
              <span className={`${!open && "hidden whitespace-nowrap"}`}>Dashboard</span>
            </NavLink>
          </li> */}


          <li className={`flex relative items-center h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-sky-300 p-3 duration-200`}>
            <NavLink
            to="/dashboard?tab=profile"
            className={`${tab === "profile" ? "text-sky-500" : ""} flex items-center justify-center gap-9`}>
              <span className='text-lg'><FaUser /></span>
              <span className={`${!open && "hidden whitespace-nowrap"}`}>Profile</span>
            </NavLink>
          </li>

          <li className={`flex relative items-center h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-sky-300 p-3 duration-200`}>
            <NavLink
            to="/logout"
            className={`flex items-center justify-center gap-9`}>
              <span className='text-lg'><LuLogOut /></span>
              <span className={`${!open && "hidden whitespace-nowrap"}`}>Logout</span>
            </NavLink>
            
          </li>
        </ul>
      </div>

    </div>
  )
}

export default DashboradSidebar