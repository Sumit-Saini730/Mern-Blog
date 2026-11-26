import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction.jsx'
import api from '../api/api.js'
import PostCard from '../components/PostCard.jsx'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/v1/posts/getposts?limit=6')

        if (response.data.success === true) {
          setPosts(response.data.data.posts)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="max-w-3xl flex flex-col items-start gap-6">

            <span className="text-sm font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              Welcome to my blog
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white">
              Ideas, insights &{' '}
              <span className="text-blue-600 dark:text-blue-400">
                everything tech.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Explore articles about web development, programming and
              technology. Learn something new and build something meaningful.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5"
              >
                Explore articles
                <span aria-hidden="true">→</span>
              </Link>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                Discover, learn and grow.
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <CallToAction />
      </section>

      {/* Recent Posts */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              From the blog
            </span>

            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Recent articles
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Explore the latest posts and insights.
            </p>
          </div>

          <Link
            to="/search"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all articles →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[360px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No articles available yet.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check back later for new posts.
            </p>
          </div>
        )}

      </section>

    </main>
  )
}

export default Home
