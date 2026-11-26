import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { signoutSuccess } from "../features/user/userSlice";
import api from "../api/api.js";

import {
  IoMenu,
  IoClose,
} from "react-icons/io5";

import {
  MdDashboard,
} from "react-icons/md";

import {
  FaUser,
} from "react-icons/fa";

import {
  LuLogOut,
} from "react-icons/lu";

import {
  HiAnnotation,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";

function DashboradSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const urlParams = new URLSearchParams(location.search);
  const activeTab = urlParams.get("tab") ||
    (currentUser?.isAdmin ? "dash" : "profile");

  // Close mobile menu whenever the selected tab changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.search]);

  const menuItems = [
    {
      name: "Dashboard",
      tab: "dash",
      icon: MdDashboard,
      adminOnly: true,
    },
    {
      name: "Profile",
      tab: "profile",
      icon: FaUser,
      adminOnly: false,
    },
    {
      name: "Posts",
      tab: "posts",
      icon: HiDocumentText,
      adminOnly: true,
    },
    {
      name: "Users",
      tab: "users",
      icon: HiOutlineUserGroup,
      adminOnly: true,
    },
    {
      name: "Comments",
      tab: "comments",
      icon: HiAnnotation,
      adminOnly: true,
    },
  ];

  const handleSignout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError("");

    try {
      const response = await api.post("/api/v1/auth/signout");

      if (response.data.success === true) {
        dispatch(signoutSuccess());
        navigate("/signin");
      } else {
        setError("Unable to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Signout error:", error);
      setError(
        error.response?.data?.message ||
        "Something went wrong while signing out."
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!currentUser) return null;

  return (
    <aside className="w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:min-h-screen sm:w-64 sm:border-b-0 sm:border-r">

      {/* Mobile Header */}
      <div className="flex items-center justify-between px-5 py-4 sm:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {currentUser.isAdmin ? "Administration" : "Account"}
          </p>

          <h2 className="mt-1 font-bold text-gray-900 dark:text-white">
            Dashboard Menu
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="rounded-xl border border-gray-200 p-2 text-xl text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {isMenuOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"
          } px-4 pb-5 sm:block sm:px-4 sm:py-6`}
      >

        {/* User Information */}
        <div className="mb-7 hidden rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/70 sm:block">
          <div className="mb-3 flex items-center gap-3">
            <img
              src={currentUser.profilePicture}
              alt={currentUser.username || "User"}
              className="h-11 w-11 rounded-full border border-gray-200 object-cover dark:border-gray-700"
            />

            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900 dark:text-white">
                {currentUser.fullName || currentUser.username}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.isAdmin ? "Administrator" : "Member"}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 px-3 py-2 text-center text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            {currentUser.isAdmin ? "Admin Account" : "Personal Account"}
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Menu
          </p>

          <ul className="space-y-1.5">
            {menuItems
              .filter((item) => !item.adminOnly || currentUser.isAdmin)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;

                return (
                  <li key={item.tab}>
                    <NavLink
                      to={`/dashboard?tab=${item.tab}`}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        }`}
                    >
                      <Icon className="shrink-0 text-xl" />

                      <span>{item.name}</span>

                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-800">
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignout}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LuLogOut className="text-xl" />

            {isSigningOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DashboradSidebar;
