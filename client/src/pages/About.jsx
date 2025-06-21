import React from 'react'

function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-2xl mx-auto p-3 text-center bg-gray-100 rounded-lg shadow-md">
        <div className="">
          <h1 className='text-3xl font-bold text-center my-7'>About My Blog</h1>
          <div className="text-lg flex flex-col gap-6">
            <p className='text-gray-500'>
              Welcome to my personal blog project — a space where I share thoughts, experiences, and knowledge through a clean, user-friendly platform built entirely with the MERN stack (MongoDB, Express, React, Node.js). This project reflects both my learning journey and passion for web development, combining frontend design with powerful backend functionality.
            </p>

            <p className='text-gray-500'>
              I built this blog from the ground up to practice full-stack development and explore how modern technologies come together to create real-world applications. From user authentication to content management and responsive UI, every feature was designed to enhance usability and performance.
            </p>

            <p className='text-gray-500'>
              This blog is more than just a coding exercise — it’s a personal milestone that showcases my skills, growth, and dedication to continuous learning. I’ll keep updating it with new features and improvements as I grow as a developer. Thanks for stopping by and being part of the journey!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About