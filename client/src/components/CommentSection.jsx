import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/api.js";
import Comment from "./Comment.jsx";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);

    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);

    const [isSure, setIsSure] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/api/v1/comments/getcomments/${postId}`
                );

                if (isMounted && response.data.success === true) {
                    setComments(response.data.data.comments || []);
                }
            } catch (error) {
                console.error("Unable to fetch comments:", error);
            }
        };

        fetchComments();

        return () => {
            isMounted = false;
        };
    }, [postId]);

    const submitComment = async (e) => {
        e.preventDefault();

        const trimmedComment = comment.trim();

        if (!trimmedComment || trimmedComment.length > 200) {
            setCommentError("Please enter a comment between 1 and 200 characters.");
            return;
        }

        if (!currentUser?._id) {
            setCommentError("Please sign in to submit a comment.");
            return;
        }

        setIsSubmitting(true);
        setCommentError(null);

        try {
            const response = await api.post("/api/v1/comments/create", {
                content: trimmedComment,
                postId,
                userId: currentUser._id,
            });

            if (response.data.success === false) {
                setCommentError(
                    response.data.message || "Unable to submit your comment."
                );
                return;
            }

            if (response.data.success === true) {
                setComments((prev) => [
                    ...prev,
                    response.data.data.comment,
                ]);

                setComment("");
            }
        } catch (error) {
            setCommentError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikes = async (commentId) => {
        if (!currentUser) return;

        try {
            const response = await api.put(
                `/api/v1/comments/likecomment/${commentId}`
            );

            if (response.data.success === true) {
                setComments((prev) =>
                    prev.map((item) =>
                        item._id === commentId
                            ? {
                                ...item,
                                likes: response.data.data.comment.likes,
                                numberOfLikes:
                                    response.data.data.comment.numberOfLikes,
                            }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error("Unable to like comment:", error);
        }
    };

    const handleCommentUpdate = (updatedComment, newContent) => {
        setComments((prev) =>
            prev.map((item) =>
                item._id === updatedComment._id
                    ? { ...item, content: newContent }
                    : item
            )
        );
    };

    const openDeleteConfirmation = (commentId) => {
        setCommentToDelete(commentId);
        setIsSure(true);
    };

    const closeDeleteConfirmation = () => {
        if (isDeleting) return;

        setIsSure(false);
        setCommentToDelete(null);
    };

    const handleCommentDelete = async () => {
        if (!currentUser || !commentToDelete) return;

        setIsDeleting(true);

        try {
            const response = await api.delete(
                `/api/v1/comments/deletecomment/${commentToDelete}`
            );

            if (response.data.success === false) {
                setCommentError(
                    response.data.message || "Unable to delete this comment."
                );
                return;
            }

            if (response.data.success === true) {
                setComments((prev) =>
                    prev.filter((item) => item._id !== commentToDelete)
                );

                setIsSure(false);
                setCommentToDelete(null);
                setCommentError(null);
            }
        } catch (error) {
            setCommentError(
                error.response?.data?.message ||
                "Unable to delete this comment. Please try again."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full">

            {/* Signed-in user */}
            {currentUser ? (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                    <img
                        src={currentUser.profilePicture}
                        alt={currentUser.username || "User"}
                        className="h-11 w-11 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                    />

                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Commenting as
                        </p>

                        <Link
                            to="/dashboard?tab=profile"
                            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                            @{currentUser.username}
                        </Link>
                    </div>

                    <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                        Signed in
                    </span>
                </div>
            ) : (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            Want to join the discussion?
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Sign in to share your thoughts.
                        </p>
                    </div>
                    <Link
                        to="/signin"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Sign in
                    </Link>
                </div>
            )}

            {/* Comment form */}
            {currentUser && (
                <form
                    onSubmit={submitComment}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5"
                >
                    <label
                        htmlFor="comment"
                        className="mb-3 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                        Write a comment
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setCommentError(null);
                        }}
                        rows={4}
                        maxLength={200}
                        placeholder="Share your thoughts about this article..."
                        className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-950"
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <p
                            className={`text-xs ${comment.length >= 200
                                    ? "text-red-500"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            {200 - comment.length} characters remaining
                        </p>

                        <button
                            type="submit"
                            disabled={isSubmitting || !comment.trim()}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Post comment"}
                        </button>
                    </div>

                    {commentError && (
                        <p role="alert" className="mt-3 text-sm text-red-500">
                            {commentError}
                        </p>
                    )}
                </form>
            )}

            {/* Comment list heading */}
            <div className="mb-4 mt-9 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Discussion
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    Community
                </span>
            </div>

            {/* Comment list */}
            {comments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center dark:border-gray-700">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">
                        No comments yet
                    </p>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Be the first to share your thoughts.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {comments.map((item) => (
                        <Comment
                            key={item._id}
                            comment={item}
                            onLike={handleLikes}
                            onUpdate={handleCommentUpdate}
                            onDelete={openDeleteConfirmation}
                        />
                    ))}
                </div>
            )}

            {/* Delete confirmation dialog */}
            {isSure && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                    onClick={closeDeleteConfirmation}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-comment-title"
                        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-950">
                                <HiOutlineExclamationCircle className="text-4xl text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        <h3
                            id="delete-comment-title"
                            className="text-center text-lg font-bold text-gray-900 dark:text-white"
                        >
                            Delete this comment?
                        </h3>

                        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                            This action cannot be undone. Are you sure you want to continue?
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteConfirmation}
                                disabled={isDeleting}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleCommentDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommentSection;
