import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import PostCard from './PostCard';
import Spinner from './Spinner';

function Search() {
    const location = useLocation();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");

        if (searchTerm || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl || "",
                sort: sortFromUrl || "desc",
                category: categoryFromUrl || "uncategorized",
            })
        }

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const searchQuery = urlParams.toString();
                const response = await api.get(`/api/v1/posts/getposts?${searchQuery}`);
                if (response.data.success === true) {
                    setPosts(response.data.data.posts);
                    setLoading(false);
                    if (response.data.data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
                if (response.data.success === false) {
                    setLoading(false);
                    return
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
            })
        }
        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setSidebarData({
                ...sidebarData,
                sort: order,
            })
        }
        if (e.target.id === "category") {
            const category = e.target.value || "uncategorized";
            setSidebarData({
                ...sidebarData,
                category: category,
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("category", sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        try {
            const response = await api.get(`/api/v1/posts/getposts?${searchQuery}`);
            if (response.data.success === true) {
                setPosts((prev) => [...prev, ...response.data.data.posts]);
                if (response.data.data.posts.length === 9) {
                    setShowMore(true);
                }else{
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                setShowMore(false);
        }
        }
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b sm:border-b-0 md:border-r md:min-h-screen border-gray-500">
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input className='p-2 text-black dark:bg-sky-50 rounded-xl border shadow-lg border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 duration-100' type="text" placeholder='Search...' id='searchTerm' value={sidebarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Sort:</label>
                        <select className='p-2 text-black dark:bg-sky-50 rounded-xl border shadow-lg border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 duration-100' id='sort' onChange={handleChange} value={sidebarData.sort}>
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Category:</label>
                        <select className='p-2 text-black dark:bg-sky-50 rounded-xl border shadow-lg border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 duration-100' id='category' onChange={handleChange} value={sidebarData.category}>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                            <option value="javascript">JavaScript</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>

                    <button type='submit' className='bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:outline-none focus:ring-sky-500 focus:ring-offset-2 text-white p-3 rounded-lg transition duration-200 font-semibold'>Search</button>
                </form>
            </div>

            <div className="w-full">
                <h1 className='text-3xl font-semibold p-3 sm:border-b border-gray-500 mt-5'>Search Results</h1>
                <div className="p-3">
                    {!loading && posts.length === 0 && <p className='p-3 text-xl text-gray-400'>No posts found</p>}
                    {
                        loading && <div className='min-h-screen flex items-center justify-center'>
                            <Spinner />
                        </div>
                    }
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                        {
                            !loading && posts.length > 0 && posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))
                        }
                    </div>
                    {
                        showMore && <button onClick={handleShowMore} className='p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-md'>Show more</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search