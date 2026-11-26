import { useState } from "react";
import api from "../api/api.js";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginStart, loginSuccess, loginFailure } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function SignIn() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);

  const login = async (data) => {
    try {
      dispatch(loginStart());

      const response = await api.post("api/v1/auth/signin", data);

      if (response.data.success === false) {
        dispatch(loginFailure(response.data.message || "Unable to sign in."));
        return;
      }

      if (response.data.success === true) {
        dispatch(loginSuccess(response.data.data.user));
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.request
          ? "No response from server. Please try again later."
          : "An error occurred. Please try again.");

      dispatch(loginFailure(message));
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-5 py-12 text-gray-800 dark:bg-gray-950 dark:text-gray-100 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-2">
        {/* Left panel */}
        <section className="flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 text-white sm:p-12">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Welcome back
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Good to see you again.
          </h1>

          <p className="mt-5 max-w-md leading-7 text-gray-300">
            Sign in to your account and continue exploring articles, sharing
            ideas, and being part of the InspireHub community.
          </p>

          <Link
          to="/"
          className="flex flex-shrink-0 items-center gap-1.5 text-xl font-bold tracking-tight sm:text-2xl"
          aria-label="Inspire Hub home"
        >
          <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-white">
            INSPIRE
          </span>

          <span className="text-slate-900 dark:text-white">
            Hub<span className="text-blue-600 dark:text-blue-400">.</span>
          </span>
        </Link>
        </section>

        {/* Sign-in form */}
        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl dark:text-gray-100">Sign in</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(login)} className="space-y-5">
            <div>
              <Input
                label="Email address"
                type="email"
                {...register("email", {
                  required: "Email address is required",
                  validate: {
                    matchPattern: (value) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ||
                      "Please enter a valid email address",
                  },
                  onBlur: (e) =>
                    setValue("email", e.target.value.trim()),
                })}
              />

              {errors.email && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                id="password"
                className="pr-14"
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-5 top-[38px] text-xl text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {errors.password && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {authError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
              >
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:bg-gray-900">
                  Or continue with
                </span>
              </div>
            </div>

            <OAuth />
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default SignIn;
