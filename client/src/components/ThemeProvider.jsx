import React from 'react'
import { useSelector } from 'react-redux'

function ThemeProvider({ children }) {
    const { mode } = useSelector((state) => state.theme)
    return (
        <div className={mode}>
            <div className='bg-white text-gray-800 dark:text-white dark:bg-slate-800 min-h-screen'>
                {children}
            </div>
        </div>
    )
}

export default ThemeProvider