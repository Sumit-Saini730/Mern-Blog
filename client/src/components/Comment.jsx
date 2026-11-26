import { useEffect, useState } from "react";
import api from "../api/api.js";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Comment({ comment, onLike, onUpdate, onDelete }) {
    const { currentUser } = useSelector((state) => state.user);

    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(comment.content);

    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const getUser = async () => {
            try {
                const response = await api.get(
                    `/api/v1/users/${comment.userId}`
                );

                if (
                    isMounted &&
                    response.data.success === true
                ) {
                    setUser(response.data.data.user);
                }
            } catch (error) {
                console.error("Unable to fetch comment author:", error);
            }
        };

        getUser();

        return () => {
            isMounted = false;
        };
    }, [comment.userId]);

    // Keep local content in sync with updates from the parent.
    useEffect(() => {
        setUpdatedComment(comment.content);
    }, [comment.content]);

    const handleCommentUpdate = () => {
        setIsEditing(true);
        setUpdatedComment(comment.content);
        setEditError(null);
    };

    const handleSave = async () => {
        const trimmedContent = updatedComment.trim();

        if (!trimmedContent) {
            setEditError("Comment cannot be empty.");
            return;
        }

        if (trimmedContent.length > 200) {
            setEditError("Comment cannot exceed 200 characters.");
            return;
        }

        setIsSaving(true);
        setEditError(null);

        try {
            const response = await api.patch(
                `/api/v1/comments/updatecomment/${comment._id}`,
                { content: trimmedContent }
            );

            if (response.data.success === false) {
                setEditError(
                    response.data.message || "Unable to update comment."
                );
                return;
            }

            if (response.data.success === true) {
                setIsEditing(false);
                onUpdate(comment, trimmedContent);
            }
        } catch (error) {
            setEditError(
                error.response?.data?.message ||
                "Unable to update comment. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const likes = comment.likes || [];
    const hasLiked = currentUser
        ? likes.includes(currentUser._id)
        : false;

    const canManageComment =
        currentUser &&
        (currentUser._id === comment.userId || currentUser.isAdmin);

    return (
        <div className="flex gap-3 py-6 sm:gap-4">

            {/* User avatar */}
            <div className="shrink-0">
                <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt={user.username || "User"}
                    className="h-10 w-10 rounded-full border border-gray-200 bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800 sm:h-11 sm:w-11"
                />
            </div>

            {/* Comment body */}
            <div className="min-w-0 flex-1">

                {/* User information */}
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {user?.username ? `@${user.username}` : "Anonymous"}
                    </span>

                    <span className="text-xs text-gray-400">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {isEditing ? (
                    /* Edit mode */
                    <div>
                        <textarea
                            value={updatedComment}
                            onChange={(e) => {
                                setUpdatedComment(e.target.value);
                                setEditError(null);
                            }}
                            maxLength={200}
                            rows={3}
                            autoFocus
                            className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-950"
                        />

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-gray-400">
                                {updatedComment.length}/200 characters
                            </span>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setUpdatedComment(comment.content);
                                        setEditError(null);
                                    }}
                                    disabled={isSaving}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving || !updatedComment.trim()}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </div>

                        {editError && (
                            <p role="alert" className="mt-2 text-sm text-red-500">
                                {editError}
                            </p>
                        )}
                    </div>
                ) : (
                    /* Normal comment view */
                    <>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            {comment.content}
                        </p>

                        {/* Comment actions */}
                        <div className="mt-3 flex flex-wrap items-center gap-4">

                            <button
                                type="button"
                                onClick={() => onLike(comment._id)}
                                aria-label={hasLiked ? "Unlike comment" : "Like comment"}
                                aria-pressed={hasLiked}
                                className={`inline-flex items-center gap-2 text-xs font-semibold transition ${hasLiked
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    }`}
                            >
                                <FaThumbsUp className="text-sm" />
                                {comment.numberOfLikes || 0}
                            </button>

                            {canManageComment && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCommentUpdate}
                                        className="text-xs font-semibold text-gray-400 transition hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete(comment._id)}
                                        className="text-xs font-semibold text-gray-400 transition hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Comment;
