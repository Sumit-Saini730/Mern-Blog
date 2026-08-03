import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaTimes } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from "../features/theme/themeSlice"
import ProfileDropdown from './ProfileDropdown';
import { useForm } from 'react-hook-form';

function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const { mode } = useSelector((state) => state.theme)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  // Lock body scroll while the mobile drawer is open, and allow Escape to close it
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  // Close the drawer automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const submit = (data) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setMobileSearchOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-600 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-400' : ''}`;

  const mobileNavLinkClass = ({ isActive }) =>
    `duration-200 hover:text-sky-500 ${isActive ? 'text-sky-700 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-400' : ''}`;

  return (
    <header className='sticky top-0 z-50 bg-white dark:bg-slate-800 border-b-2 dark:border-slate-700'>
      <div className='flex justify-between items-center gap-2 p-3 sm:p-4'>
        {/* Logo */}
        <div className="flex-shrink-0 text-md sm:text-2xl font-bold whitespace-nowrap">
          <Link to="/">
            <span className='px-3 py-1.5 sm:px-4 sm:py-2 text-white bg-gradient-to-r from-[#ff234b] to-cyan-400 rounded-lg'>INSPIRE</span>
            Hub
          </Link>
        </div>

        {/* Search - visible inline from md up */}
        <form onSubmit={handleSubmit(submit)} className='relative hidden md:block flex-1 max-w-md mx-2'>
          <input
            type="text"
            placeholder='Search...'
            value={searchTerm}
            {...register("searchTerm", {
              onChange: (e) => setSearchTerm(e.target.value)
            })}
            className='w-full border-2 text-black dark:bg-sky-50 outline-sky-500 border-gray-400 p-2 rounded-3xl pr-12 pl-4'
          />
          <button type='submit' aria-label="Search">
            <AiOutlineSearch className='text-2xl absolute right-4 top-[10px] cursor-pointer hover:text-sky-500' />
          </button>
        </form>

        {/* Right side controls */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Search icon toggle - only below md, where the inline input is hidden */}
          <button
            type='button'
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
            aria-expanded={mobileSearchOpen}
            className='w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-400 rounded-full items-center flex justify-center md:hidden'
          >
            <AiOutlineSearch className='text-xl hover:text-sky-500' />
          </button>

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle dark mode"
            className='w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-400 flex justify-center cursor-pointer items-center focus:ring-2 focus:ring-sky-300 sm:text-xl text-lg hover:text-sky-500'
          >
            {mode === "dark" ? <MdSunny /> : <FaMoon />}
          </button>

          <nav className='hidden sm:flex items-center justify-center'>
            <ul className='flex font-bold text-base items-center justify-center gap-5'>
              <li>
                <NavLink to="/" className={navLinkClass}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
              </li>
              <li>
                <NavLink to="/projects" className={navLinkClass}>Projects</NavLink>
              </li>
              <li>
                {currentUser ? (
                  <ProfileDropdown />
                ) : (
                  <Link to="/signup">
                    <button className='px-4 py-1 sm:px-7 sm:py-2 border-2 bg-sky-400 rounded-lg items-center flex justify-center hover:bg-sky-500 active:bg-sky-600 focus:ring-2 focus:ring-sky-300 font-medium duration-200 text-white whitespace-nowrap'>
                      Sign Up
                    </button>
                  </Link>
                )}
              </li>
            </ul>
          </nav>

          <button
            onClick={toggleMenu}
            aria-label="Open menu"
            aria-expanded={isOpen}
            className='sm:hidden p-1 rounded border-2 flex justify-center cursor-pointer items-center hover:text-sky-500 duration-150 text-xl'
          >
            <IoMenu />
          </button>
        </div>
      </div>

      {/* Expandable search row for small/medium screens */}
      {mobileSearchOpen && (
        <form onSubmit={handleSubmit(submit)} className='relative px-3 pb-3 md:hidden'>
          <input
            type="text"
            placeholder='Search...'
            value={searchTerm}
            autoFocus
            {...register("searchTerm", {
              onChange: (e) => setSearchTerm(e.target.value)
            })}
            className='w-full border-2 text-black dark:bg-sky-50 outline-sky-500 border-gray-400 p-2 rounded-3xl pr-12 pl-4'
          />
          <button type='submit' aria-label="Search">
            <AiOutlineSearch className='text-2xl absolute right-6 top-[18px] cursor-pointer hover:text-sky-500' />
          </button>
        </form>
      )}

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className='fixed inset-0 sm:hidden bg-black/30 z-40'
          aria-hidden="true"
        />
      )}

      {/* Side navbar for smaller screens */}
      <div
        className={`text-black dark:text-white fixed top-0 right-0 sm:hidden ${isOpen ? 'flex' : 'hidden'} bg-white dark:bg-slate-800 h-screen w-4/5 max-w-xs z-50 shadow-xl`}
      >
        <ul className='flex flex-col font-bold w-full p-2'>
          <li className='my-4 ml-5'>
            <button
              onClick={toggleMenu}
              aria-label="Close menu"
              className='p-1 rounded border-2 border-gray-800 dark:border-gray-500 flex justify-center cursor-pointer items-center hover:text-sky-500 duration-150 text-xl'
            >
              <FaTimes />
            </button>
          </li>
          <li className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink to="/dashboard?tab=profile" className={mobileNavLinkClass}>Profile</NavLink>
          </li>
          <li className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink to="/" className={mobileNavLinkClass}>Home</NavLink>
          </li>
          <li className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink to="/about" className={mobileNavLinkClass}>About</NavLink>
          </li>
          <li className='w-full p-1 rounded duration-100 my-4 text-center'>
            <NavLink to="/projects" className={mobileNavLinkClass}>Projects</NavLink>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header