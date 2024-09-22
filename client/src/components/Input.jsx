import React from 'react'

function Input({
    label,
    type = "text",
    className = "",
    ...props
}) {
  return (
    <div className='w-full'>
        {label && <label
        className='inline-block mb-1 pl-1 font-bold'>
            {label}
        </label>}

        <input 
        type={type}
        className={`px-3 py-2 rounded-xl border-2 border-gray-400 outline-none focus:border-sky-500 focus:bg-sky-50 duration-100 w-full font-bold ${className}`}
        {...props}
        
        />
    </div>
  )
}

export default Input