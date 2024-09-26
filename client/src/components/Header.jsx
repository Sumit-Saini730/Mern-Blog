
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaTimes } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
function Header() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header className='flex flex-col sticky gap-y-3 top-0 z-50 bg-white'>
      <div className='flex justify-between items-center border-b-2 p-4'>
        <div className="text-md sm:text-2xl font-bold whitespace-nowrap">
          <Link to="/" >
            <span className='px-4 py-2 bg-gradient-to-r from-[#ff234b] to-cyan-400 text-white rounded-lg'>INSPIRE</span>
            Hub
          </Link>
        </div>

        <form className='relative'>
          <input
            type="text"
            placeholder='Search...'
            className='border-2 outline-sky-500 border-gray-400 p-2 rounded-3xl pr-12 pl-4 hidden lg:inline'
          />

          <span>
            <AiOutlineSearch className='text-2xl absolute right-4 top-[10px] cursor-pointer hidden lg:inline' />
          </span>

          <button className='w-10 h-10 border-2 border-gray-400 rounded-full items-center flex justify-center lg:hidden'>
            <AiOutlineSearch className='text-xl hover:text-sky-500' />
          </button>
        </form>

        <nav className='hidden sm:flex items-center justify-center'>
          <ul className='flex font-bold text-base'>
            <li className='mr-7'>
              <NavLink
                to="/"
                className={({ isActive }) => `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
              >
                Home
              </NavLink>
            </li>
            <li className='mr-7'>
              <NavLink
                to="/about"
                className={({ isActive }) => `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
              >
                About
              </NavLink>
            </li>
            <li className='mr-7'>
              <NavLink
                to="/contact"
                className={({ isActive }) => `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
              >
                Contact
              </NavLink>
            </li>
            <li className='mr-7'>
              <NavLink
                to="/projects"
                className={({ isActive }) => `duraition-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
              >
                Projects
              </NavLink>
            </li>
          </ul>
        </nav>
        <button
          onClick={toggleMenu}
          className='sm:hidden p-1 rounded border-2 flex justify-center cursor-pointer items-center hover:text-sky-500 duration-150 text-xl'>
          <IoMenu />
        </button>
      </div>

      <div className='flex bg-transparent sm:justify-end justify-between items-center px-4 py-2'>
        <button className='w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-400 flex justify-center mr-8 cursor-pointer items-center focus:ring-2 focus:ring-sky-300'>
          <FaMoon className='sm:text-2xl text-xl hover:text-sky-500' />
        </button>
        
        <Link to="/signup">
          <button className='px-4 py-1 sm:px-7 sm:py-2 border-2 bg-sky-400 rounded-lg items-center flex justify-center hover:bg-sky-500 active:bg-sky-600 focus:ring-2 focus:ring-sky-300 font-medium duration-200'>
            Sign Up
          </button>
        </Link>
      </div>

      {/* side navbar for smaller screens */}
      <div className={`fixed top-0 right-0 sm:hidden ${isOpen ? 'flex' : 'hidden'} bg-transparent backdrop-blur-md h-screen sm:w-1/2 w-full`}>
        <ul className='flex-col font-bold mt-4 w-full p-2'>
          <li
            onClick={toggleMenu}
            className='my-4 ml-5'>
            <button
              className='p-1 rounded border-2 border-gray-800 flex justify-center cursor-pointer items-center hover:text-sky-500 duration-150 text-xl'>
              <FaTimes />
            </button>
          </li>
          <li
            onClick={toggleMenu}
            className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink
              to="/"

              className={({ isActive }) => `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
            >
              Home
            </NavLink>
          </li>
          <li
            onClick={toggleMenu}
            className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink
              to="/about"
              className={({ isActive }) => `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
            >
              About
            </NavLink>
          </li>
          <li
            onClick={toggleMenu}
            className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink
              to="/contact"
              className={({ isActive }) => `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
            >
              Contact
            </NavLink>
          </li>
          <li className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink
              to="/projects"
              onClick={toggleMenu}
              className={({ isActive }) => `duraition-200 hover:text-sky-500 ${isActive ? 'text-sky-700 hover:text-sky-700' : 'text-black'}`}
            >
              Projects
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header

