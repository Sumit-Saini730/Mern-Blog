import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({ post }) {
    return (
        <div className='group relative w-full border h-[400px] overflow-hidden rounded-lg sm:h-[350px] border-sky-500 hover:border-2 p-1 transition-all duration-200'>
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt={post.title}
                    className='h-[240px] w-full object-cover rounded-lg group-hover:h-[210px] transition-all duration-300 z-20'
                />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className='text-lg font-semibold line-clamp-2 dark:text-white'>{post.title}</p>
                <span className='italic text-sm'>{post.category}</span>
                <Link className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-sky-500 bg-sky-500 hover:bg-sky-600 text-white transition-all duration-300 py-2 text-center rounded-md !rounded-tl-none !rounded-tr-none m-2' to={`/post/${post.slug}`}>Read article</Link>
            </div>
        </div>
    )
}

export default PostCard