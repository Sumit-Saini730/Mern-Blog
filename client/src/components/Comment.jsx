import api from '../api/api.js'
import { useState, useEffect } from 'react'
import moment from "moment"
import { FaThumbsUp } from "react-icons/fa"
import { useSelector } from 'react-redux'

function Comment({ comment, onLike, onUpdate, onDelete }) {
    const [user, setUser] = useState({})
    const { currentUser } = useSelector((state) => state.user)
    const [isEditing, setIsEditing] = useState(false)
    const [updatedComment, setUpdatedComment] = useState(comment.content)


    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await api.get(`/api/v1/users/${comment.userId}`)
                if (response.data.success === true) {
                    setUser(response.data.data.user)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [comment.userId])

    const handleCommentUpdate = () => {
        setIsEditing(true)
        setUpdatedComment(comment.content)
    }

    const handleSave = async () => {
        try {
            const response = await api.patch(`/api/v1/comments/updatecomment/${comment._id}`, { content: updatedComment })

            if (response.data.success === true) {
                setIsEditing(false)
                onUpdate(comment, updatedComment)
            }
        } catch (error) {
            console.log(error)
        }
    }
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
                {
                    isEditing ? (
                        <>
                            <textarea
                                value={updatedComment}
                                onChange={(e) => setUpdatedComment(e.target.value)}
                                className='w-full p-2 border border-gray-500 rounded-md focus:bg-sky-50 focus:outline-none focus:border-sky-500 mb-2'></textarea>

                            <div className='flex justify-end pr-2 gap-2'>
                                <button
                                    onClick={handleSave}
                                    type='button' className='mr-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 duration-100'>Save</button>
                                <button onClick={() => setIsEditing(false)} type='button' className='p-2 bg-gray-500 text-white rounded-md duration-100 hover:bg-gray-600 active:bg-gray-700'>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className='text-gray-700 dark:text-gray-300 pb-2'>{comment.content}</p>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => onLike(comment._id)}
                                    className={`text-gray-400 hover:text-gray-500 ${currentUser && comment.likes.includes(currentUser._id) ? "!text-blue-500" : ""}`}
                                >
                                    <FaThumbsUp className='text-sm active:scale-110' />
                                </button>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>{comment.numberOfLikes || 0}</span>

                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <>
                                            <button onClick={handleCommentUpdate} className='text-gray-400 hover:text-blue-500'>
                                                Edit
                                            </button>

                                            <button onClick={() => onDelete(comment._id)} className='text-gray-400 hover:text-blue-500'>
                                                Delete
                                            </button>
                                        </>
                                    )
                                }



                            </div>
                        </>
                    )
                }

            </div>
        </div>
    )
}

export default Comment
