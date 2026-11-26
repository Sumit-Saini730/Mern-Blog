import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api.js";
import { signoutSuccess } from "../features/user/userSlice";

import { LuLogOut } from "react-icons/lu";
import {
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineXMark,
} from "react-icons/hi2";

import default_image from "../assets/default_image.jpg";

function ProfileDropdown() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    setError("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError("");

    try {
      const response = await api.post("api/v1/auth/signout");

      if (response.data.success) {
        dispatch(signoutSuccess());
        setIsOpen(false);
        navigate("/signin");
      } else {
        setError(response.data.message || "Unable to sign out.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      {/* Profile button */}
      <button
        ref={avatarRef}
        type="button"
        onClick={toggleMenu}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
      >
        <img
          src={currentUser.profilePicture || default_image}
          alt={currentUser.username || "Profile"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = default_image;
          }}
          className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover dark:border-gray-700"
        />

        <HiOutlineChevronDown
          className={`hidden text-gray-500 transition-transform duration-200 sm:block dark:text-gray-400 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            ref={dropdownRef}
            className="absolute right-0 top-14 z-50 w-72 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl shadow-black/10 dark:border-gray-700 dark:bg-gray-800"
          >
            {/* User information */}
            <div className="flex items-center gap-3 p-4">
              <img
                src={currentUser.profilePicture || default_image}
                alt={currentUser.username || "Profile"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = default_image;
                }}
                className="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover dark:border-gray-600"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                  {currentUser.fullName || currentUser.username}
                </h3>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.email}
                </p>

                {currentUser.isAdmin && (
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* Menu links */}
            <div className="p-2">
              <Link
                to="/dashboard?tab=profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <HiOutlineUser className="text-xl" />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleSignout}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                {isSigningOut ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <LuLogOut className="text-xl" />
                )}

                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>

              {error && (
                <p className="px-3 py-2 text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Close */}
            <div className="border-t border-gray-100 p-2 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <HiOutlineXMark className="text-lg" />
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileDropdown;
