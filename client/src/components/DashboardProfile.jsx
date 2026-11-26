import { useEffect, useState } from "react";
import Input from "./Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import default_image from "../assets/default_image.jpg";
import { useForm } from "react-hook-form";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api.js";
import { Link, useNavigate } from "react-router-dom";

function DashboardProfile() {
  const { currentUser, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      password: "",
    },
  });

  // Create and clean up the selected image preview URL.
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handleUpdateProfile = async (data) => {
    setUpdateMessage("");
    setUpdateError("");

    try {
      dispatch(updateStart());

      const formData = new FormData();

      formData.append("username", data.username.trim());
      formData.append("password", data.password || "");

      if (data.profilePicture?.length > 0) {
        formData.append("profilePicture", data.profilePicture[0]);
      }

      const response = await api.patch(
        `api/v1/users/update/${currentUser._id}`,
        formData
      );

      if (response.data.success) {
        dispatch(updateSuccess(response.data.data.user));

        setUpdateMessage(
          response.data.message || "Profile updated successfully."
        );

        setImageFile(null);

        // Clear the success message after a few seconds.
        setTimeout(() => {
          setUpdateMessage("");
        }, 3000);
      } else {
        const message =
          response.data.message || "Unable to update your profile.";

        dispatch(updateFailure(message));
        setUpdateError(message);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request
          ? "No response from server. Please try again."
          : "Something went wrong. Please try again.");

      dispatch(updateFailure(message));
      setUpdateError(message);
    }
  };

  const handleDeleteUser = async () => {
    setDeleteError("");
    setIsDeleting(true);

    try {
      dispatch(deleteUserStart());

      const response = await api.delete(
        `api/v1/users/delete/${currentUser._id}`
      );

      if (response.data.success) {
        dispatch(deleteUserSuccess(response.data.message));
        setIsSure(false);
        navigate("/signin");
      } else {
        const message =
          response.data.message || "Unable to delete your account.";

        dispatch(deleteUserFailure(message));
        setDeleteError(message);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong while deleting your account.";

      dispatch(deleteUserFailure(message));
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your account information and profile details.
        </p>
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleSubmit(handleUpdateProfile)}
        encType="multipart/form-data"
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8"
      >
        {/* Profile image */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <img
              src={imagePreview || currentUser.profilePicture || default_image}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = default_image;
              }}
              className="h-32 w-32 rounded-full border-4 border-gray-100 object-cover shadow-md dark:border-gray-700"
            />

            <label
              htmlFor="profilePicture"
              className="absolute bottom-1 right-0 cursor-pointer rounded-full border-2 border-white bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700 dark:border-gray-800"
            >
              Edit
            </label>

            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("profilePicture", {
                onChange: handleImageChange,
                validate: {
                  fileType: (files) => {
                    if (!files || files.length === 0) return true;

                    return (
                      files[0].type.startsWith("image/") ||
                      "Please select a valid image."
                    );
                  },
                  fileSize: (files) => {
                    if (!files || files.length === 0) return true;

                    return (
                      files[0].size <= 2 * 1024 * 1024 ||
                      "Image size must be less than 2MB."
                    );
                  },
                },
              })}
            />
          </div>

          {errors.profilePicture && (
            <p className="mt-3 text-center text-sm text-red-500">
              {errors.profilePicture.message}
            </p>
          )}

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or other image formats. Maximum size: 2MB.
          </p>
        </div>

        {/* Account information */}
        <div className="space-y-5">
          <div>
            <Input
              id="username"
              type="text"
              label="Username"
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters.",
                },
                validate: (value) =>
                  value.trim().length >= 3 ||
                  "Username must be at least 3 characters.",
              })}
            />

            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Input
              id="email"
              type="email"
              label="Email Address"
              value={currentUser.email || ""}
              disabled
            />

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your email address cannot be changed here.
            </p>
          </div>

          {currentUser.authProvider === "local" && (
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="New Password"
                placeholder="Leave blank to keep your current password"
                {...register("password", {
                  validate: (value) =>
                    !value ||
                    value.length >= 6 ||
                    "Password must be at least 6 characters.",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-[38px] text-xl text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Update error */}
        {(updateError || (error && !updateMessage)) && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {updateError || error}
          </p>
        )}

        {/* Update success */}
        {updateMessage && (
          <p className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            {updateMessage}
          </p>
        )}

        {/* Update button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-800"
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </form>

      {/* Admin shortcut */}
      {currentUser.isAdmin && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Admin Actions
          </h2>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and publish a new blog post.
          </p>

          <Link
            to="/create-post"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Create a Post
          </Link>
        </div>
      )}

      {/* Delete account */}
      <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Danger Zone
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Deleting your account is permanent. Make sure you really want to do
          this.
        </p>

        <button
          type="button"
          onClick={() => {
            setDeleteError("");
            setIsSure(true);
          }}
          className="mt-4 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Delete Account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {isSure && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => !isDeleting && setIsSure(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <HiOutlineExclamationCircle className="text-5xl text-red-500" />
            </div>

            <h2
              id="delete-account-title"
              className="text-center text-xl font-bold text-gray-900 dark:text-white"
            >
              Delete your account?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            {deleteError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {deleteError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsSure(false)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardProfile;