import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from "react-redux"
import { HiOutlineExclamationCircle } from "react-icons/hi";
import default_image from "../assets/default_image.jpg"
import Spinner from "./Spinner.jsx"


function DashComments() {
  const { currentUser } = useSelector((state) => state.user)
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const comments = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/v1/comments/getallcomments`)
        // console.log(response)
        if (response.data.success === true) {
          setComments(response.data.data.comments)
          setLoading(false)
          if (response.data.data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {

      }
    }
    if (currentUser.isAdmin) {
      comments()
    }
  }, [])

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const response = await axios.get(`api/v1/comments/getallcomments?startIndex=${startIndex}`)
      console.log(response)

      if (response.data.success === true) {
        setUsers(prev => [...prev, ...response.data.data.users]);
        if (response.data.data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      const response = await axios.delete(`api/v1/comments/deletecomment/${commentIdToDelete}`)
      // console.log(response)
      if (response.data.success === false) {
        alert(response.data.message)
      }
      if (response.data.success === true) {
        setComments((prev) => prev.filter(comment => comment._id !== commentIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  )

  return (
    <div className="overflow-x-auto p-4 md:mx-auto max-w-screen-lg custom-scrollbar">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <table className="min-w-[800px] table-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left">
              <tr>
                <th className="px-4 py-2">Date updated</th>
                <th className="px-4 py-2">Comment content</th>
                <th className="px-4 py-2">Number of likes</th>
                <th className="px-4 py-2">PostId</th>
                <th className="px-4 py-2">UserId</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
              {comments.map((comment) => (
                <tr
                  key={comment._id}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-2">{new Date(comment.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    {comment.content}
                  </td>
                  <td className="px-4 py-2">
                    {comment.numberOfLikes}
                  </td>
                  <td className="px-4 py-2">
                    {comment.postId}
                  </td>
                  <td className="px-4 py-2 capitalize">{comment.userId}</td>
                  <td className="px-4 py-2">
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setCommentIdToDelete(comment._id)
                      }}
                      className="cursor-pointer text-red-600 hover:underline font-medium">Delete</span>
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
        <p className="text-center text-gray-500 dark:text-gray-300">No comments to show</p>
      )}

      <div className={`${showModal ? "flex" : "hidden"} top-0 left-0 items-center justify-center fixed w-full h-screen bg-transparent backdrop-blur-md`}>
        <div className='p-6 rounded-xl w-96 bg-gray-100 border-2 border-red-300'>
          <div>
            <HiOutlineExclamationCircle className='text-6xl text-gray-500 mx-auto' />
          </div>
          <p className='text-lg font-semibold text-wrap text-black text-center'>Are you sure you want to delete this comment?</p>
          <div className='flex justify-between'>
            <button
              onClick={() => setShowModal(false)}
              className='p-3 px-6 mt-5 text-sky-500 text-lg font-semibold text-center border-2 border-sky-500 hover:bg-sky-200 rounded-xl bg-sky-100 duration-200'
            >
              No, cancel
            </button>

            <button
              onClick={handleDeleteComment}
              className='p-3 px-6 mt-5 text-white rounded-lg text-lg font-semibold bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 border-2 active:bg-red-700 duration-200'
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default DashComments