import React from 'react'

function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border-2 border-sky-500 rounded-tl-3xl rounded-br-3xl text-center justify-center items-center'>
        <div className='flex-1 justify-center items-center flex flex-col'>
            <h2 className='text-2xl dark:text-white'>Want to learn more about JavaScript?</h2>
            <p className='text text-gray-400 my-2'>Checkout these resources with 100 JavaScript Projects</p>

            <button className='bg-gradient-to-r from-[#ff234b] to-cyan-400 text-white p-3 rounded-lg transition duration-300 ease-in-out hover:scale-105'><a href='#'>Learn More</a></button>
        </div>
        <div className='p-7 flex-1'>
            <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" alt="" />
        </div>
    </div>
  )
}

export default CallToAction