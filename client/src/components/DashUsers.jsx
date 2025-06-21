import React, { useEffect, useState } from 'react'
import api from '../api/api.js'
import { useSelector } from "react-redux"
import { FaCheck, FaTimes} from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import default_image from "../assets/default_image.jpg"
import Spinner from "./Spinner.jsx"

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  // console.log(userPosts)

  useEffect(() => {
    const users = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/api/v1/users/getusers`)
        // console.log(response)
        if (response.data.success === true) {
          setUsers(response.data.data.users)
          setLoading(false)
          if (response.data.data.users.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {

      }
    }
    if (currentUser.isAdmin) {
      users()
    }
  }, [])

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const response = await api.get(`api/v1/posts/getusers?startIndex=${startIndex}`)
      // console.log(response)

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

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      const response = await api.delete(`api/v1/users/delete/${userIdToDelete}`)
      // console.log(response)
      if(response.data.success === false){
        alert(response.data.message)
      }
      if (response.data.success === true) {
        setUsers((prev) => prev.filter(user => user._id !== userIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }

  if(loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  )

  return (
    <div className="overflow-x-auto p-4 md:mx-auto max-w-screen-lg custom-scrollbar">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <table className="min-w-[800px] table-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left">
              <tr>
                <th className="px-4 py-2">Date Created</th>
                <th className="px-4 py-2">User Image</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                      <img
                        src={user.profilePicture || default_image}
                        alt={user.username}
                        className="w-14 h-14 object-cover border rounded-full shadow-sm"
                      />
                  </td>
                  <td className="px-4 py-2">
                      {user.username}
                  </td>
                  <td className="px-4 py-2">
                      {user.email}
                  </td>
                  <td className="px-4 py-2 capitalize">{user.isAdmin ? (<FaCheck className='text-green-500'/>) : (<FaTimes className="text-red-600"/>)}</td>
                  <td className="px-4 py-2">
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setUserIdToDelete(user._id)
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
        <p className="text-center text-gray-500 dark:text-gray-300">No users to show</p>
      )}

      <div className={`${showModal ? "flex" : "hidden"} top-0 left-0 items-center justify-center fixed w-full h-screen bg-transparent backdrop-blur-md`}>
        <div className='p-6 rounded-xl w-96 bg-gray-100 border-2 border-red-300'>
          <div>
            <HiOutlineExclamationCircle className='text-6xl text-gray-500 mx-auto' />
          </div>
          <p className='text-lg font-semibold text-wrap text-black text-center'>Are you sure you want to delete this user?</p>
          <div className='flex justify-between'>
            <button
              onClick={() => setShowModal(false)}
              className='p-3 px-6 mt-5 text-sky-500 text-lg font-semibold text-center border-2 border-sky-500 hover:bg-sky-200 rounded-xl bg-sky-100 duration-200'
            >
              No, cancel
            </button>

            <button
              onClick={handleDeleteUser}
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

export default DashUsers