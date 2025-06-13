import React, { useState } from 'react'
import Spinner from "./Spinner.jsx"
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import CallToAction from './CallToAction.jsx'
import CommentSection from './CommentSection.jsx'

function PostPage() {
  const { postSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [post, setPost] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/v1/posts/getposts?slug=${postSlug}`)

        if (response.data.success === false) {
          setError(response.data.message)
          setLoading(false)
          return
        }
        if (response.data.success === true) {
          setPost(response.data.data.posts[0])
          setLoading(false)
          setError(null)
        }

      } catch (error) {
        setError(error.message || "An error occurred. Please try again later.");
        setLoading(false)
      }

    }
    fetchPost()
  }, [postSlug])

  if(loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  )
  return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
          <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>

          <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
            <button className='bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-3 rounded'>{post && post.category}</button>
          </Link>

          <div className=''>
            <img src={post && post.image} alt={post && post.title} className="mt-10 w-full object-cover mx-auto p-3 max-h-[600px]" />
          </div>

          <div className='flex justify-between p-3 border-b border-slate-400 mx-auto w-full max-w-2xl text-sm'>
            <span>
              {post && new Date(post.createdAt).toDateString()}
            </span>
            <span>
              {post && (post.content.length/1000).toFixed(0)} mins read
            </span>
          </div>

          <div className='p-3 mt-5 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>
          </div>

          <div className='max-w-4xl mx-auto w-full'>
            <CallToAction />
          </div>

          <CommentSection postId={post._id}/>
        </main>
  )
}

export default PostPage