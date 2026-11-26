import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xl font-bold sm:text-2xl"
            >
              <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-white">
                INSPIRE
              </span>
              <span className="text-slate-900 dark:text-white">
                Hub<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A place to explore technology, discover programming
              resources and learn something new every day.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Projects
                </Link>
              </li>
            </ul>
          </div>
          {/* Information */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Information
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-center dark:border-slate-800 sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Inspire Hub. All rights reserved.
          </p>
          <Link
            to="/"
            className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            Built with React & MERN Stack
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
