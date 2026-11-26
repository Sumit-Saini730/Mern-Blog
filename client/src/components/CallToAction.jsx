
function CallToAction() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-900">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative grid grid-cols-1 items-center gap-8 p-7 sm:p-10 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start">
          <span className="mb-4 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
            Level up your skills
          </span>
          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            Want to learn more about JavaScript?
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            Take your JavaScript skills further with practical projects.
            Explore useful resources and turn what you learn into something real.
          </p>
          <a
            href="https://www.google.com/search?q=100+JavaScript+projects"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 hover:-translate-y-0.5"
          >
            Explore resources
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <img
            src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg"
            alt="JavaScript development"
            loading="lazy"
            className="h-56 w-full object-cover sm:h-72 lg:h-80"
          />
        </div>
      </div>
    </section>
  )
}

export default CallToAction
