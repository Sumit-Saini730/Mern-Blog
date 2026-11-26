import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import PostCard from "./PostCard";
import Spinner from "./Spinner";

function Search() {
    const location = useLocation();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [error, setError] = useState("");

    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",
    });

    // Read filters from URL and fetch matching posts
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searchTerm = urlParams.get("searchTerm") || "";
        const sort = urlParams.get("sort") || "desc";
        const category = urlParams.get("category") || "uncategorized";

        setSidebarData({
            searchTerm,
            sort,
            category,
        });

        let isActive = true;

        const fetchPosts = async () => {
            setLoading(true);
            setError("");
            setPosts([]);
            setShowMore(false);

            try {
                const response = await api.get(
                    `/api/v1/posts/getposts?${urlParams.toString()}`
                );

                if (!isActive) return;

                if (response.data.success) {
                    const fetchedPosts = response.data.data.posts || [];

                    setPosts(fetchedPosts);
                    setShowMore(fetchedPosts.length === 9);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                if (!isActive) return;

                console.error("Error fetching posts:", error);
                setError("Something went wrong while fetching posts. Please try again.");
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isActive = false;
        };
    }, [location.search]);

    // Handle filter changes
    const handleChange = (e) => {
        const { id, value } = e.target;

        setSidebarData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Submit filters and update URL
    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();

        if (sidebarData.searchTerm.trim()) {
            urlParams.set("searchTerm", sidebarData.searchTerm.trim());
        }

        urlParams.set("sort", sidebarData.sort);
        urlParams.set("category", sidebarData.category);

        navigate(`/search?${urlParams.toString()}`);
    };

    // Reset filters
    const handleReset = () => {
        navigate("/search");
    };

    // Load more posts
    const handleShowMore = async () => {
        if (loadingMore) return;

        setLoadingMore(true);

        try {
            const urlParams = new URLSearchParams(location.search);
            urlParams.set("startIndex", posts.length);

            const response = await api.get(
                `/api/v1/posts/getposts?${urlParams.toString()}`
            );

            if (response.data.success) {
                const newPosts = response.data.data.posts || [];

                setPosts((prev) => [...prev, ...newPosts]);
                setShowMore(newPosts.length === 9);
            } else {
                setShowMore(false);
            }
        } catch (error) {
            console.error("Error loading more posts:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">

                {/* Filter Sidebar */}
                <aside className="h-fit w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-24 lg:w-72">
                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Explore
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                            Find articles
                        </h2>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Search and discover articles from the blog.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Search Term */}
                        <div>
                            <label
                                htmlFor="searchTerm"
                                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Search term
                            </label>

                            <input
                                type="text"
                                id="searchTerm"
                                placeholder="Search articles..."
                                value={sidebarData.searchTerm}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label
                                htmlFor="sort"
                                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Sort by
                            </label>

                            <select
                                id="sort"
                                value={sidebarData.sort}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="desc">Newest first</option>
                                <option value="asc">Oldest first</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                value={sidebarData.category}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="uncategorized">Uncategorized</option>
                                <option value="reactjs">React.js</option>
                                <option value="nextjs">Next.js</option>
                                <option value="javascript">JavaScript</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3 pt-2">
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            >
                                Search articles
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Reset filters
                            </button>
                        </div>
                    </form>
                </aside>

                {/* Search Results */}
                <main className="min-w-0 flex-1">

                    {/* Results Header */}
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-5 dark:border-gray-800">
                        <div>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Blog / Search
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                Search Results
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {loading
                                    ? "Finding articles..."
                                    : `${posts.length} ${posts.length === 1 ? "article" : "articles"} found`}
                            </p>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex min-h-[350px] items-center justify-center">
                            <Spinner size={42} />
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
                            <p className="font-medium text-red-700 dark:text-red-400">
                                {error}
                            </p>

                            <button
                                onClick={() => navigate(`/search?${location.search.replace(/^\?/, "")}`)}
                                className="mt-4 text-sm font-semibold text-red-700 underline dark:text-red-400"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && !error && posts.length === 0 && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl dark:bg-gray-800">
                                <span role="img" aria-label="Search">
                                    🔎
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                No articles found
                            </h2>

                            <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                                We couldn't find any articles matching your search. Try
                                changing your search term or selecting another category.
                            </p>
                        </div>
                    )}

                    {/* Post Cards */}
                    {!loading && !error && posts.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>

                            {/* Show More */}
                            {showMore && (
                                <div className="mt-10 flex justify-center">
                                    <button
                                        onClick={handleShowMore}
                                        disabled={loadingMore}
                                        className="rounded-xl border border-blue-600 px-8 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                                    >
                                        {loadingMore ? "Loading..." : "Show more articles"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Search;
