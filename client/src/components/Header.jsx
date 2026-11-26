import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaTimes } from 'react-icons/fa'
import { MdSunny } from 'react-icons/md'
import { IoMenu } from 'react-icons/io5'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../features/theme/themeSlice'
import ProfileDropdown from './ProfileDropdown'

function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const { mode } = useSelector((state) => state.theme)

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Sync search input with URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    setSearchTerm(urlParams.get('searchTerm') || '')
  }, [location.search])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setMobileSearchOpen(false)
  }, [location.pathname])

  // Handle body scroll and Escape key
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const submitSearch = (event) => {
    event.preventDefault()

    const urlParams = new URLSearchParams(location.search)

    if (searchTerm.trim()) {
      urlParams.set('searchTerm', searchTerm.trim())
    } else {
      urlParams.delete('searchTerm')
    }

    const query = urlParams.toString()
    navigate(query ? `/search?${query}` : '/search')

    setMobileSearchOpen(false)
    setIsOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors duration-200 ${isActive
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
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

        {/* Desktop Search */}
        <form
          onSubmit={submitSearch}
          className="relative hidden max-w-md flex-1 md:block"
        >
          <input
            type="search"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-5 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          <button
            type="submit"
            aria-label="Search articles"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <AiOutlineSearch />
          </button>
        </form>

        {/* Right Controls */}
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">

          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
            aria-expanded={mobileSearchOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-blue-400 md:hidden"
          >
            <AiOutlineSearch />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-all hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:text-slate-300 dark:hover:text-blue-400"
          >
            {mode === 'dark' ? <MdSunny /> : <FaMoon />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact us
            </NavLink>

            {currentUser ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Sign Up
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200 md:hidden"
          >
            {isOpen ? <FaTimes /> : <IoMenu />}
          </button>

        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <form
          onSubmit={submitSearch}
          className="border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden"
        >
          <div className="relative">
            <input
              type="search"
              placeholder="Search articles..."
              autoFocus
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-5 pr-12 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <button
              type="submit"
              aria-label="Search articles"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 hover:text-blue-600 dark:text-slate-400"
            >
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      )}

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 top-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed right-0 top-0 z-[60] flex h-dvh w-[min(20rem,85vw)] flex-col bg-white shadow-2xl dark:bg-slate-900 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            Navigation
          </span>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavLink to="/" end className={mobileNavLinkClass}>Home</NavLink>
          <NavLink to="/about" className={mobileNavLinkClass}>About</NavLink>
          <NavLink to="/projects" className={mobileNavLinkClass}>Projects</NavLink>
          <NavLink to="/contact" className={mobileNavLinkClass}>Contact us</NavLink>

          {currentUser ? (
            <NavLink to="/dashboard?tab=profile" className={mobileNavLinkClass}>
              My Profile
            </NavLink>
          ) : (
            <NavLink to="/signup" className={mobileNavLinkClass}>
              Sign Up
            </NavLink>
          )}
        </nav>

        <div className="border-t border-slate-200 p-5 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore, learn and build something meaningful.
          </p>
        </div>
      </aside>
    </header>
  )
}

export default Header
