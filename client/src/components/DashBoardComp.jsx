import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/api.js'
import Spinner from "./Spinner.jsx"
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { Link } from 'react-router-dom'

function DashBoardComp() {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)
    // const [loading, setLoading] = useState(true)
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const users = async () => {
            try {
                const res = await api.get("/api/v1/users/getusers?limit=5")
                if (res.data.success === true) {
                    setUsers(res.data.data.users)
                    setTotalUsers(res.data.data.totalUsers)
                    setLastMonthUsers(res.data.data.lastMonthUsers)
                }
            } catch (error) {
                console.log(error)
            }
        }
        const posts = async () => {
            try {
                const res = await api.get("/api/v1/posts/getposts?limit=5")
                if (res.data.success === true) {
                    setPosts(res.data.data.posts)
                    setTotalPosts(res.data.data.totalPosts)
                    setLastMonthPosts(res.data.data.lastMonthPosts)
                }
            } catch (error) {
                console.log(error)
            }
        }
        const comments = async () => {
            try {
                const res = await api.get("/api/v1/comments/getallcomments?limit=5")
                if (res.data.success === true) {
                    setComments(res.data.data.comments)
                    setTotalComments(res.data.data.totalComments)
                    setLastMonthComments(res.data.data.lastMonthComments)
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (currentUser.isAdmin === true) {
            users()
            posts()
            comments()
        }
    }, [currentUser])

    // if (loading) return (
    //     <div className='min-h-screen flex items-center justify-center'>
    //         <Spinner />
    //     </div>
    // )
    return (
        <div className='p-3 md:mx-auto'>
            <div className='flex-wrap flex gap-4 justify-center'>
                <div className='flex flex-col p-3 dark:bg-slate-700 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='dark:text-white text-md uppercase'>Total Users</h3>
                            <p className='text-2xl dark:text-white'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className=''>Last month</div>
                    </div>
                </div>

                <div className='flex flex-col p-3 dark:bg-slate-700 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-md uppercase dark:text-white'>
                                Total Comments
                            </h3>
                            <p className='text-2xl dark:text-white'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className=''>Last month</div>
                    </div>
                </div>

                <div className='flex flex-col p-3 dark:bg-slate-700 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='dark:text-white text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl dark:text-white'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className=''>Last month</div>
                    </div>
                </div>

            </div>

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-700">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className='text-center p-2'>Recent Users</h1>
                        <button className='bg-sky-500 p-2 text-white rounded-md hover:bg-sky-600'>
                            <Link to={"/dashboard?tab=users"}>See all</Link>
                        </button>
                    </div>
                    <table className='table-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden'>
                        <thead className='bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left'>
                            <tr>
                                <th className="px-4 py-2">User image</th>
                                <th className="px-4 py-2">Username</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-300 dark:divide-gray-600'>
                            {users.map((user) => (
                                <tr className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition" key={user._id}>
                                    <td className="px-4 py-2"><img src={user.profilePicture} alt="" className='w-10 h-10 rounded-full bg-slate-500' /></td>
                                    <td className="px-4 py-2">{user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-700">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className='text-center p-2'>Recent comments</h1>
                        <button className='bg-sky-500 p-2 text-white rounded-md hover:bg-sky-600'>
                            <Link to={"/dashboard?tab=comments"}>See all</Link>
                        </button>
                    </div>
                    <table className='table-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden'>
                        <thead className='bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left'>
                            <tr>
                                <th className="px-4 py-2">Comment content</th>
                                <th className="px-4 py-2">Likes</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-300 dark:divide-gray-600'>
                            {comments.map((comment) => (
                                <tr className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition" key={comment._id}>
                                    <td className="px-4 py-2 line-clamp-2 w-96">{comment.content}</td>
                                    <td className="px-4 py-2">{comment.numberOfLikes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-700">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className='text-center p-2'>Recent posts</h1>
                        <button className='bg-sky-500 p-2 text-white rounded-md hover:bg-sky-600'>
                            <Link to={"/dashboard?tab=posts"}>See all</Link>
                        </button>
                    </div>
                    <table className='table-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden'>
                        <thead className='bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left'>
                            <tr>
                                <th className="px-4 py-2">Post image</th>
                                <th className="px-4 py-2">Post title</th>
                                <th className="px-4 py-2">Category</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-300 dark:divide-gray-600'>
                            {posts.map((post) => (
                                <tr className="bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition" key={post._id}>
                                    <td className="px-4 py-2"><img src={post.image} alt="" className='w-14 h-10 rounded-md bg-slate-500' /></td>
                                    <td className="px-4 py-2 w-96">{post.title}</td>
                                    <td className="px-4 py-2 w-5">{post.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DashBoardComp