import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction.jsx'
import api from '../api/api.js'
import PostCard from '../components/PostCard.jsx'

function Home() {
  const [posts, setPosts] = useState([])

  // console.log(posts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const reponse = await api.get("/api/v1/posts/getposts?limit=6")
        if (reponse.data.success === true) {
          setPosts(reponse.data.data.posts)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()
  }, [])
  return (
    <div className=''>
      <div className=" flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>This is a simple blog app built with React, Node.js, Express, and MongoDB.</p>

        <Link to={"/search"} className='text-xs sm:text-sm text-sky-500 font-bold hover:underline'>View all posts</Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className=''>
            <h2 className='text-2xl font-semibold text-center dark:text-white'>Recent Posts</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={"/search"} className='text-lg text-sky-500 font-bold hover:underline text-center'>View all posts</Link>
          </div>
        )}
      </div> 
    </div>
  )
}

export default Home