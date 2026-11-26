import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
    HiRefresh,
} from "react-icons/hi";

import api from "../api/api.js";
import Spinner from "./Spinner.jsx";

function StatCard({ title, total, lastMonth, icon: Icon, iconStyle }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {total.toLocaleString()}
                    </h2>
                </div>

                <div className={`rounded-xl p-3 ${iconStyle}`}>
                    <Icon className="text-2xl" />
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <HiArrowNarrowUp className="text-lg" />
                    {lastMonth.toLocaleString()}
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                    added last month
                </span>
            </div>
        </div>
    );
}

function SectionHeader({ title, to }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">
                {title}
            </h2>

            <Link
                to={to}
                className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
                See all →
            </Link>
        </div>
    );
}

function DashBoardComp() {
    const { currentUser } = useSelector((state) => state.user);

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let isActive = true;

        const fetchDashboardData = async () => {
            if (currentUser?.isAdmin !== true) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            const requests = await Promise.allSettled([
                api.get("/api/v1/users/getusers?limit=5"),
                api.get("/api/v1/posts/getposts?limit=5"),
                api.get("/api/v1/comments/getallcomments?limit=5"),
            ]);

            if (!isActive) return;

            const [usersResult, postsResult, commentsResult] = requests;

            if (usersResult.status === "fulfilled") {
                const data = usersResult.value.data;

                if (data.success) {
                    setUsers(data.data.users || []);
                    setTotalUsers(data.data.totalUsers || 0);
                    setLastMonthUsers(data.data.lastMonthUsers || 0);
                }
            }

            if (postsResult.status === "fulfilled") {
                const data = postsResult.value.data;

                if (data.success) {
                    setPosts(data.data.posts || []);
                    setTotalPosts(data.data.totalPosts || 0);
                    setLastMonthPosts(data.data.lastMonthPosts || 0);
                }
            }

            if (commentsResult.status === "fulfilled") {
                const data = commentsResult.value.data;

                if (data.success) {
                    setComments(data.data.comments || []);
                    setTotalComments(data.data.totalComments || 0);
                    setLastMonthComments(data.data.lastMonthComments || 0);
                }
            }

            if (requests.some((result) => result.status === "rejected")) {
                setError(
                    "Some dashboard information could not be loaded. You can try refreshing."
                );
            }

            setLoading(false);
        };

        fetchDashboardData();

        return () => {
            isActive = false;
        };
    }, [currentUser?.isAdmin, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    if (currentUser?.isAdmin !== true) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Access restricted
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        You don't have permission to view this dashboard.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size={42} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Dashboard Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Administration
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Overview of your blog activity and recent content.
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <HiRefresh className="text-lg" />
                        Refresh
                    </button>
                </div>
                {error && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Users"
                        total={totalUsers}
                        lastMonth={lastMonthUsers}
                        icon={HiOutlineUserGroup}
                        iconStyle="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    />

                    <StatCard
                        title="Total Comments"
                        total={totalComments}
                        lastMonth={lastMonthComments}
                        icon={HiAnnotation}
                        iconStyle="bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                    />

                    <StatCard
                        title="Total Posts"
                        total={totalPosts}
                        lastMonth={lastMonthPosts}
                        icon={HiDocumentText}
                        iconStyle="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    />
                </div>

                {/* Recent Activity */}
                <div className="mt-10">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Recent activity
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            The latest users, comments, and posts on your blog.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                        {/* Recent Users */}
                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <SectionHeader title="Recent Users" to="/dashboard?tab=users" />

                            {users.length === 0 ? (
                                <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                    No users found.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
                                            <tr>
                                                <th className="px-5 py-3 font-semibold">User</th>
                                                <th className="px-5 py-3 font-semibold">Username</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {users.map((user) => (
                                                <tr
                                                    key={user._id}
                                                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="px-5 py-3">
                                                        {user.profilePicture ? (
                                                            <img
                                                                src={user.profilePicture}
                                                                alt={user.username || "User"}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                                {(user.username || "U")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">
                                                        {user.username}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        {/* Recent Comments */}
                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <SectionHeader
                                title="Recent Comments"
                                to="/dashboard?tab=comments"
                            />

                            {comments.length === 0 ? (
                                <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                    No comments found.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
                                            <tr>
                                                <th className="px-5 py-3 font-semibold">
                                                    Comment
                                                </th>
                                                <th className="whitespace-nowrap px-5 py-3 font-semibold">
                                                    Likes
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {comments.map((comment) => (
                                                <tr
                                                    key={comment._id}
                                                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="max-w-[280px] px-5 py-4">
                                                        <p className="line-clamp-2 text-gray-700 dark:text-gray-300">
                                                            {comment.content}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                                                        {comment.numberOfLikes ?? comment.likes?.length ?? 0}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        {/* Recent Posts */}
                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
                            <SectionHeader title="Recent Posts" to="/dashboard?tab=posts" />

                            {posts.length === 0 ? (
                                <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                    No posts found.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
                                            <tr>
                                                <th className="px-5 py-3 font-semibold">Post</th>
                                                <th className="px-5 py-3 font-semibold">Title</th>
                                                <th className="px-5 py-3 font-semibold">Category</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {posts.map((post) => (
                                                <tr
                                                    key={post._id}
                                                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="px-5 py-3">
                                                        {post.image ? (
                                                            <img
                                                                src={post.image}
                                                                alt={post.title || "Post"}
                                                                className="h-12 w-16 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 dark:bg-gray-800">
                                                                No image
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="max-w-xs px-5 py-3 font-medium text-gray-800 dark:text-gray-200">
                                                        <span className="line-clamp-2">
                                                            {post.title}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-3">
                                                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                            {post.category}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoardComp;
