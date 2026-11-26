import { useEffect, useState } from "react";
import Input from "../components/Input.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [publishResponse, setPublishResponse] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState(null);

  const navigate = useNavigate();

  // Clean up temporary image URLs when the preview changes or the page unmounts.
  useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
      }
    };
  }, [tempImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setTempImageUrl(URL.createObjectURL(file));
    } else {
      setTempImageUrl(null);
    }
  };

  const submitPost = async (data) => {
    setPublishError(null);
    setPublishResponse(null);

    const formData = new FormData();

    formData.append("title", data.title.trim());
    formData.append("category", data.category);
    formData.append("content", data.content);
    formData.append("postImage", data.postImage[0]);

    try {
      const response = await api.post(
        "api/v1/posts/create",
        formData
      );

      if (response.data.success === false) {
        setPublishError(
          response.data.message || "Unable to publish your post."
        );
        return;
      }

      if (response.data.success === true) {
        setPublishResponse(
          response.data.message || "Post published successfully!"
        );

        setTimeout(() => {
          navigate(`/post/${response.data.data.post.slug}`);
        }, 2000);
      }
    } catch (error) {
      setPublishError(
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again later."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Page heading */}
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Content management
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Create a new post
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Share your ideas, knowledge, and experiences with your readers.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitPost)}
          encType="multipart/form-data"
          className="space-y-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
        >

          {/* Title and category */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Post title
              </label>

              <Input
                id="title"
                type="text"
                placeholder="Enter an interesting title"
                className="w-full"
                {...register("title", {
                  required: "Please enter a post title.",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters long.",
                  },
                  onBlur: (e) =>
                    setValue("title", e.target.value.trim()),
                })}
              />

              {errors.title && (
                <p className="text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Category
              </label>

              <select
                id="category"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-blue-950"
                {...register("category")}
              >
                <option value="uncategorized">Select a category</option>
                <option value="javascript">JavaScript</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="postImage"
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Featured image
              </label>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose an image for your post. Maximum file size: 2 MB.
              </p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-500">
              <input
                id="postImage"
                type="file"
                accept="image/*"
                className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-blue-700 dark:text-gray-400"
                {...register("postImage", {
                  required: "Please select a featured image.",
                  onChange: handleImageChange,
                  validate: {
                    fileSize: (files) =>
                      !files?.[0] ||
                      files[0].size <= 2 * 1024 * 1024 ||
                      "Image size should be less than 2 MB.",

                    imageType: (files) =>
                      !files?.[0] ||
                      files[0].type.startsWith("image/") ||
                      "Please select a valid image file.",
                  },
                })}
              />

              {errors.postImage && (
                <p className="mt-3 text-sm text-red-500">
                  {errors.postImage.message}
                </p>
              )}
            </div>

            {/* Image preview */}
            {tempImageUrl && (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Image preview
                  </p>
                </div>

                <img
                  src={tempImageUrl}
                  alt="Selected post preview"
                  className="max-h-96 w-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Post content */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                Post content
              </label>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Write and format your article below.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
              <Controller
                name="content"
                control={control}
                rules={{
                  required: "Please write some content for your post.",
                }}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    {...field}
                    placeholder="Start writing your post..."
                    className="post-editor bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  />
                )}
              />
            </div>

            {errors.content && (
              <p className="text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Publish button */}
          <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900 sm:w-auto sm:min-w-48"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Publishing...
                </>
              ) : (
                "Publish post"
              )}
            </button>
          </div>
        </form>

        {/* Success message */}
        {publishResponse && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
          >
            {publishResponse} Redirecting to your post...
          </div>
        )}

        {/* Error message */}
        {publishError && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
          >
            {publishError}
          </div>
        )}
      </div>
    </main>
  );
}

export default CreatePost;
