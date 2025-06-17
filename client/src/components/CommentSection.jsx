import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useEffect } from 'react'
import Comment from './Comment'

function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const { register, handleSubmit } = useForm()

    // console.log(comments)

    const submit = async (data) => {
        // console.log(data)
        if (comment.length > 200 || comment.length < 1) return
        try {
            const response = await axios.post(`/api/v1/comments/create`, { content: comment, postId: postId, userId: currentUser._id })

            if (response.data.success === false) {
                alert(response.data.message)
            }
            if (response.data.success === true) {
                // console.log(response)
                setComment('')
                setCommentError(null)
                setComments((prev) => [...prev, response.data.data.comment])
            }
        } catch (error) {
            setCommentError(error.response.data.message)
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/v1/comments/getcomments/${postId}`)

                if (response.data.success === true) {
                    setComments(response.data.data.comments)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchComments()
    }, [postId])

    const handleLikes = async (commentId) => {
        if (!currentUser) {
            // alert("You must be signed in to like a comment")
            return
        }
        try {
            const response = await axios.put(`/api/v1/comments/likecomment/${commentId}`)
            // console.log(response)

            if (response.data.success === true) {
                setComments((prev) => prev.map((comment) => comment._id === commentId ? {
                    ...comment,
                    likes: response.data.data.comment.likes,
                    numberOfLikes: response.data.data.comment.numberOfLikes
                }
                    : comment)
                )
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleCommentUpdate = async (comment, updatedComment) => {
        setComments( (prev) => prev.map((c) => c._id === comment._id ? { ...c, content: updatedComment } : c) )
    }
    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {
                currentUser ?
                    (
                        <div className='flex items-center gap-2 my-5 text-gray-400'>
                            <p className='font-semibold dark:text-white'>Signed in as:</p>
                            <img className='w-10 h-10 rounded-full object-cover' src={currentUser.profilePicture} alt="" />
                            <Link className='text-cyan-600 hover:underline' to={`/dashboard?tab=profile`}>@{currentUser.username}</Link>
                        </div>
                    ) :
                    (
                        <div className='flex items-center gap-2 my-5 dark:text-white'>
                            <p className='font-semibold'>You must be signed in to comment.</p>
                            <Link className='text-blue-500 hover:underline' to="/signin">Sign in</Link>
                        </div>
                    )
            }
            {
                currentUser && (
                    <form onSubmit={handleSubmit(submit)} className='border border-sky-500 rounded-xl p-3'>
                        <textarea
                            {...register("comment", { required: true })}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            maxLength={200}
                            placeholder='Write a comment...'
                            className='w-full p-3 border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 text-black dark:bg-sky-50 rounded-xl border-2 shadow-lg'>
                        </textarea>

                        <div className='flex justify-between mt-5 items-center'>
                            <p className='text-gray-400 text-sm'>Characters left: {200 - comment.length}</p>
                            <button type='submit' className='bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-white py-2 px-4 rounded-xl transition active:bg-sky-700'>Submit</button>
                        </div>
                        {commentError && <p className='text-red-500 mt-5'>{commentError}</p>}
                    </form>
                )
            }
            {
                comments.length === 0 ? (
                    <p className='text-gray-400 my-5 dark:text-white'>No comments yet.</p>
                ) :
                    (
                        <>
                            <div className='text-sm my-5 flex items-center gap-2'>
                                <p className='dark:text-white'>Comments</p>
                                <div className='border border-sky-500 py-1 px-2 rounded-sm '>
                                    <p className='dark:text-white'>{comments.length}</p>
                                </div>
                            </div>

                            {
                                comments.map((comment) => (
                                    <Comment key={comment._id} comment={comment} onLike={handleLikes} onUpdate={handleCommentUpdate} />
                                ))
                            }
                        </>
                    )
            }
        </div>
    )
}

export default CommentSection