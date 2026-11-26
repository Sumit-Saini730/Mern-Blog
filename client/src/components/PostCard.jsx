import { Link } from 'react-router-dom'

function PostCard({ post }) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50 dark:hover:shadow-black/20">

            <Link
                to={`/post/${post.slug}`}
                className="block overflow-hidden"
            >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-5">

                <span className="mb-3 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {post.category}
                </span>

                <Link to={`/post/${post.slug}`}>
                    <h3 className="text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                <div className="mt-auto pt-5">
                    <Link
                        to={`/post/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all duration-200 hover:gap-3 dark:text-blue-400"
                    >
                        Read article
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

            </div>
        </article>
    )
}

export default PostCard
