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
    if (tabFromUrl) {
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
    <div className={`sm:h-full sm:w-56 w-full bg-gray-50 shadow-lg border-r-2 border-t-2 rounded-lg dark:bg-[#12171e] p-3 transition-all ease-in-out duration-300 text-black dark:text-white`}>
      <hr className='mt-14 sm:hidden' />
      <div className={`mt-2`}>
        {isAdmin ? <h2 className={`font-bold text-center bg-gray-200 dark:bg-gray-700 rounded-lg`}>Admin</h2> : null}
        <p className='font-bold text-center whitespace-nowrap'>{currentUser.fullName}</p>
      </div>

      <div className='mt-2'>

        <div className='flex items-center justify-between text-lg font-semibold mb-2 sm:hidden'>
          <span>Menu</span>
          <button className='rounded-lg text-xl hover:bg-sky-300 p-2' onClick={toggleMenu}>{open ? <FaTimes /> : <IoMenu />}</button>
        </div>
         <ul className={`flex flex-col gap-y-3 p-1 ${!open && "sm:flex hidden"}`}>

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
              <span>Profile</span>
            </NavLink>
          </li>

          <li className={`flex relative items-center h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-sky-300 p-3 duration-200`}>
            <NavLink
              to="/logout"
              className={`flex items-center justify-center gap-9`}>
              <span className='text-lg'><LuLogOut /></span>
              <span>Logout</span>
            </NavLink>

          </li>
        </ul>
      </div>

    </div>
  )
}

export default DashboradSidebar