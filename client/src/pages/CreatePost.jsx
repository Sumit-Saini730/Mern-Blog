import React, { useState } from 'react'
import Input from "../components/Input.jsx"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm, Controller } from 'react-hook-form';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function CreatePost() {

  const { register, setValue, handleSubmit, control, formState: { errors, isSubmitting } } = useForm();
  const [publishResponse, setPublishResponse] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const Submit = async (data) => {
    // console.log(data)
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("content", data.content);
    formData.append("postImage", data.postImage[0]);
    try {
      const response = await axios.post("api/v1/posts/create", formData);
      console.log(response)
      if (response.data.success === false) {
        setPublishError(response.data.message)
        return
      }
      if (response.data.success === true) {
        setPublishResponse(response.data.message)
        setTimeout(() => {
          setPublishResponse(null);
          navigate(`/post/${response.data.data.post.slug}`)
        }, 3000);
      }

    } catch (error) {
      setPublishError(error.message || "An error occurred. Please try again later.");
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form onSubmit={handleSubmit(Submit)} encType='multipart/form-data' className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <Input
              type="text"
              placeholder="Title"
              required
              id='title'
              className="flex-1 placeholder:text-gray-600"
              {...register("title", {
                required: true,
                minLength: { value: 3, message: "Title must be at least 3 characters long" },
                onBlur: (e) => setValue("title", e.target.value.trim())
              })}
            />
            {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
          <select
            required
            className='px-2 py-2 text-gray-600 dark:bg-sky-50 rounded-xl border-2 shadow-lg border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 duration-100 font-bold'
            {...register("category")}
          >
            <option className='rounded-xl' value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </select>
        </div>
        <div className='flex items-center border-4 border-sky-500 rounded-xl p-3'>
          <input
            required
            className='border-2 w-full font-semibold bg-gray-100 text-black rounded-xl cursor-pointer file:py-2 file:px-4 sm:file:py-3 sm:file:px-6 file:bg-sky-500 file:text-white file:border-none file file:mr-5 hover:file:bg-sky-600 hover:file:cursor-pointer'
            type="file"
            accept='image/*'
            {...register("postImage", {
              required: true,
              validate: {
                fileSize: (file) => {
                  return file[0].size <= 2 * 1024 * 1024 || "Image size should be less than 2MB"
                }
              }

            })}
          />
          {errors.postImage && <p className='text-red-500 m-2'>{errors.postImage.message}</p>}
        </div>

        <div className='rounded-xl overflow-hidden'>
          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <ReactQuill theme="snow" {...field} placeholder="Write your post here..." className='h-72 mb-12' />}
          />
        </div>

        <button
          type='sumbit'
          className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 active:bg-gradient-to-r active:from-cyan-700 active:to-blue-700 font-bold border-2 border-sky-500 duration-200 transition mb-2 p-4 rounded-lg {isSubmitting ? "bg-gray-400 disabled cursor-not-allowed" : ""}`}>
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </form>

      {publishResponse && <p className='text-green-500 mt-2 p-3 w-full text-lg font-semibold text-center border-2 border-green-500 rounded-xl py-2 bg-green-100'>{publishResponse}</p>}
      {publishError && <p className='text-red-500 mt-2 p-3 w-full text-lg font-semibold text-center border-2 border-red-500 rounded-xl py-2 bg-red-100'>{publishError}</p>}
    </div>
  )
}

export default CreatePost