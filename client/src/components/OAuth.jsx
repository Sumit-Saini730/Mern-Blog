import { useState } from "react";
import googleLogo from "../assets/google.png";
import { app } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../features/user/userSlice";

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      dispatch(loginStart());

      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const googleResponse = await signInWithPopup(auth, provider);

      const response = await api.post("/api/v1/auth/google", {
        name: googleResponse.user.displayName,
        email: googleResponse.user.email,
        googlePhotoUrl: googleResponse.user.photoURL,
      });

      if (response.data.success === true) {
        dispatch(loginSuccess(response.data.data.user));
        navigate("/");
      } else {
        throw new Error(
          response.data.message || "Google sign-in failed."
        );
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in with Google. Please try again.";

      setError(message);
      dispatch(loginFailure(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="my-3 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <img
          className="h-5 w-5"
          src={googleLogo}
          alt=""
        />

        <span>
          {loading ? "Connecting to Google..." : "Continue with Google"}
        </span>
      </button>

      {error && (
        <p
          role="alert"
          className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default OAuth;
