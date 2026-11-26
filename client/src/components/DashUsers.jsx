import { useEffect, useState } from "react";
import api from "../api/api.js";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  HiOutlineUsers,
  HiOutlineTrash,
  HiArrowPath,
} from "react-icons/hi2";
import default_image from "../assets/default_image.jpg";
import Spinner from "./Spinner.jsx";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      if (!currentUser?._id || !currentUser?.isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/v1/users/getusers");

        if (!isMounted) return;

        if (response.data.success) {
          const fetchedUsers = response.data.data.users || [];

          setUsers(fetchedUsers);
          setShowMore(fetchedUsers.length >= 9);
        } else {
          setError(response.data.message || "Unable to load users.");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            "Something went wrong while loading users."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [currentUser?._id, currentUser?.isAdmin, retryCount]);

  const handleShowMore = async () => {
    if (showMoreLoading || !currentUser?._id) return;

    setShowMoreLoading(true);
    setError("");

    try {
      const startIndex = users.length;

      const response = await api.get(
        `/api/v1/users/getusers?startIndex=${startIndex}`
      );

      if (response.data.success) {
        const newUsers = response.data.data.users || [];

        setUsers((prev) => [...prev, ...newUsers]);

        if (newUsers.length < 9) {
          setShowMore(false);
        }
      } else {
        setError(response.data.message || "Unable to load more users.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load more users. Please try again."
      );
    } finally {
      setShowMoreLoading(false);
    }
  };

  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    setDeleteError("");
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setShowModal(false);
    setUserIdToDelete(null);
    setDeleteError("");
  };

  const handleDeleteUser = async () => {
    if (!userIdToDelete || deleteLoading) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await api.delete(
        `/api/v1/users/delete/${userIdToDelete}`
      );

      if (response.data.success) {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        );

        setShowModal(false);
        setUserIdToDelete(null);
      } else {
        setDeleteError(
          response.data.message || "Unable to delete this user."
        );
      }
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      {/* Page heading */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <HiOutlineUsers className="text-2xl text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Users
            </h1>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            View registered users and manage their accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total users
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {users.length}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <p>{error}</p>

          <button
            onClick={() => setRetryCount((prev) => prev + 1)}
            className="flex shrink-0 items-center gap-1 font-semibold hover:underline"
          >
            <HiArrowPath />
            Retry
          </button>
        </div>
      )}

      {/* Users table */}
      {users.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Date Joined</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    >
                      {/* User information */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePicture || default_image}
                            alt={user.username || "User"}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = default_image;
                            }}
                            className="h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover dark:border-gray-600"
                          />

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                              {user.username}
                            </p>

                            {user._id === currentUser._id && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                          : "—"}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        {user.isAdmin ? (
                          <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            User
                          </span>
                        )}
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => openDeleteModal(user._id)}
                          disabled={user._id === currentUser._id}
                          title={
                            user._id === currentUser._id
                              ? "You cannot delete your own account here"
                              : "Delete user"
                          }
                          aria-label={`Delete ${user.username}`}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {showMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleShowMore}
                disabled={showMoreLoading}
                className="flex items-center gap-2 rounded-lg border border-blue-600 px-6 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                {showMoreLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </>
                ) : (
                  "Show More Users"
                )}
              </button>
            </div>
          )}

          {!showMore && users.length >= 9 && (
            <p className="mt-6 text-center text-sm text-gray-400">
              You've reached the end of the user list.
            </p>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
            <HiOutlineUsers className="text-3xl text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            No users found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Registered users will appear here when they create an account.
          </p>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <HiOutlineExclamationCircle className="text-3xl text-red-600 dark:text-red-400" />
            </div>
            <h2
              id="delete-user-title"
              className="text-center text-xl font-bold text-gray-900 dark:text-white"
            >
              Delete this user?
            </h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to permanently delete this user's account?
              This action cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  "Yes, delete user"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashUsers;