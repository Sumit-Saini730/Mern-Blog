import axios from 'axios'
import { useState, useEffect } from 'react'
import moment from "moment"

function Comment({comment}) {

    const [user, setUser] = useState({})

    // console.log(user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/api/v1/users/${comment.userId}`)

                if(response.data.success === true) {
                    console.log(response)
                    setUser(response.data.data.user)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [comment])
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt="user.username" />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-xs truncate'>
                    {user ? `@${user.username}`: "anonymous"}
                </span>
                <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
            </div>
            <p className='text-gray-700 dark:text-gray-300 pb-2'>{comment.content}</p>
        </div>
    </div>
  )
}

export default Comment