import React from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";
function Footer() {
  return (
    <footer className='border-t-4 border-sky-500 rounded-t-3xl'>
      <div className='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
        <div className='md:flex md:justify-between'>
          <div className="text-lg sm:text-2xl font-bold mb-8 md:mb-0">
            <Link to="/" >
              <span className='px-4 py-2 bg-gradient-to-r from-[#ff234b] to-cyan-400 text-white rounded-lg'>INSPIRE</span>
              Hub
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
            <div>
              <h2 className='mb-3 font-bold uppercase'>about</h2>
              <ul>
                <li>
                  <Link to="#" className='hover:underline pb-2 text-sm font-semibold'>Mern Projects</Link>
                </li>
                <li>
                  <Link to="#" className='hover:underline pb-2 text-sm font-semibold'>Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-3 font-bold uppercase'>contact us</h2>
              <ul>
                <li>
                  <Link to="#" className='hover:underline pb-2 text-sm font-semibold'>Github</Link>
                </li>
                <li>
                  <Link to="#" className='hover:underline pb-2 text-sm font-semibold'>Discord</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-3 font-bold uppercase'>legal</h2>
              <ul>
                <li>
                  <Link to="#" className='hover:underline pb-2 text-sm font-semibold'>Privacy Policy</Link>
                </li>
                <li>
                  <Link to="#" className='hover:underline pb-2 text-sm font-semibold'>Terms &amp; Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-sky-500 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="sm:text-center">
            © {new Date().getFullYear()}
            <Link to="#" className="hover:underline">
              sumitsaini'sblog
            </Link>
            . All Rights Reserved.
          </span>

          <div className='flex space-x-5 sm:mt-0 mt-4'>
            <Link className='hover:text-sky-500' to="#"><BsFacebook/></Link>
            <Link className='hover:text-sky-500' to="#"><BsInstagram/></Link>
            <Link className='hover:text-sky-500' to="#"><BsTwitter/></Link>
            <Link className='hover:text-sky-500' to="#"><BsGithub/></Link>
            <Link className='hover:text-sky-500' to="#"><BsDribbble/></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer