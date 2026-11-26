import { Link } from "react-router-dom";

const technologies = [
  "MongoDB",
  "Express.js",
  "React",
  "Node.js",
  "JavaScript",
  "Tailwind CSS",
];

function Projects() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Page heading */}
        <section className="mb-14">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            My work
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Projects and experiments.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            A collection of projects I've worked on while learning web
            development. Each one has helped me understand new concepts and
            improve my practical skills.
          </p>
        </section>

        {/* Featured project */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Featured project
            </span>
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* Project preview */}
            <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-10">
              <div className="w-full max-w-xl rounded-xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <div className="mb-5 h-3 w-1/3 rounded bg-white/30" />
                <div className="mb-3 h-2 w-full rounded bg-white/15" />
                <div className="mb-6 h-2 w-4/5 rounded bg-white/15" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-lg bg-blue-400/20 sm:h-24" />
                  <div className="h-16 rounded-lg bg-white/10 sm:h-24" />
                </div>
              </div>
            </div>

            {/* Project information */}
            <div className="p-6 sm:p-9">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  First full-stack project
                </span>
                <span className="text-sm text-gray-500">
                  MERN Stack
                </span>
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl dark:text-gray-100">
                Blog Application
              </h2>

              <p className="mt-4 max-w-3xl leading-8 text-gray-600 dark:text-gray-400">
                A full-stack blogging application built as part of my journey
                into web development. I followed a YouTube tutorial to learn
                how to connect a React frontend with an Express and Node.js
                backend, and how to work with MongoDB.
              </p>

              <h3 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-wider text-gray-500">
                What I explored
              </h3>

              <ul className="grid gap-3 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  Frontend and backend integration
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  User authentication
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  Working with MongoDB
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  Blog content management
                </li>
              </ul>

              <div className="mt-7 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                  This is a learning project that I plan to continue improving
                  as I gain more development experience.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Future projects */}
        <section className="mt-12 rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center dark:border-gray-700 sm:px-10">
          <h2 className="text-xl font-bold">More projects coming soon</h2>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600 dark:text-gray-400">
            I'm continuing to learn and build. I'll add more projects and
            experiments here as I work on new ideas and develop my skills.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold">Want to explore the blog?</h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Take a look at the articles published on this website.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Explore articles
            <span className="ml-2">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Projects;
