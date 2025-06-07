import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom'

function DashPosts() {

  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  // console.log(userPosts)

  useEffect(() => {
    const posts = async () => {
      try {
        const response = await axios.get(`api/v1/posts/getposts?author=${currentUser._id}`)
        // console.log(response)
        if (response.data.success === true) {
          setUserPosts(response.data.data.posts)
          if (response.data.data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {

      }
    }
    if (currentUser.isAdmin) {
      posts()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const response = await axios.get(`api/v1/posts/getposts?author=${currentUser._id}&startIndex=${startIndex}`)
      console.log(response)

      if(response.data.success === true){
        setUserPosts(prev => [...prev, ...response.data.data.posts]);
        if (response.data.data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="overflow-x-auto p-4 md:mx-auto max-w-screen-lg custom-scrollbar">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <table className="min-w-[800px] table-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left">
              <tr>
                <th className="px-4 py-2">Date Updated</th>
                <th className="px-4 py-2">Post Image</th>
                <th className="px-4 py-2">Post Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Delete</th>
                <th className="px-4 py-2">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
              {userPosts.map((post) => (
                <tr
                  key={post._id}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-2">{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-24 h-14 object-cover border rounded shadow-sm"
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Link className="font-medium text-blue-600 dark:text-blue-400 hover:underline" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 capitalize">{post.category}</td>
                  <td className="px-4 py-2">
                    <span className="cursor-pointer text-red-600 hover:underline font-medium">Delete</span>
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`update-post/${post._id}`}>
                      <span className="text-sky-500 hover:underline font-medium">Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore &&
            <div className='w-full flex justify-center py-2'>
              <button
              onClick={handleShowMore} 
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 duration-200 transition">Show More</button>
            </div>
          }
        </>

      ) : (
        <p className="text-center text-gray-500 dark:text-gray-300">No posts to show</p>
      )}
    </div>

  )
}

export default DashPosts