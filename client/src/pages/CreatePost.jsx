import React from 'react'
import Input from "../components/Input.jsx"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <Input type="text" placeholder="Title" required id='title' className="flex-1 placeholder:text-gray-600" />
            <select className='px-2 py-2 text-gray-600 dark:bg-sky-50 rounded-xl border-2 shadow-lg border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 duration-100 w-full font-bold'>
              <option className='rounded-xl' value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </select>
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-sky-500 rounded-xl p-3 border-dotted'>
            <input className='border-2 w-auto sm:w-full font-semibold bg-gray-100 text-black rounded-xl cursor-pointer file:py-2 file:px-4 sm:file:py-3 sm:file:px-6 file:bg-sky-500 file:text-white file:border-none file file:mr-5 hover:file:bg-sky-600 hover:file:cursor-pointer' type="file" accept='image/*' />

            <button type='button' className='bg-white text-gray-900 hover:bg-gradient-to-r from-cyan-500 to-blue-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 font-bold border-2 border-sky-500 duration-200 hover:text-white transition p-4 rounded-lg'>Upload Image</button>
          </div>

          <ReactQuill theme="snow" placeholder="Write something..." className='h-72 mb-12 border-2'/>
        </form>
    </div>
  )
}

export default CreatePost