import axios from 'axios'
import { useState, useEffect } from 'react'
import moment from "moment"
import { FaThumbsUp } from "react-icons/fa"
import { useSelector } from 'react-redux'

function Comment({ comment, onLike }) {
    const [user, setUser] = useState({})
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/api/v1/users/${comment.userId}`)
                if (response.data.success === true) {
                    setUser(response.data.data.user)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [comment.userId]) // use more specific dependency

    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user?.username ? `@${user.username}` : "anonymous"}
                    </span>
                    <span className='text-xs text-gray-500 ml-2'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className='text-gray-700 dark:text-gray-300 pb-2'>{comment.content}</p>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => onLike(comment._id)}
                        className={`text-gray-400 hover:text-gray-500 ${currentUser && comment.likes.includes(currentUser._id) ? "!text-blue-500" : ""}`}
                    >
                        <FaThumbsUp className='text-sm active:scale-110' />
                    </button>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>{comment.numberOfLikes || 0}</span>
                </div>
            </div>
        </div>
    )
}

export default Comment
