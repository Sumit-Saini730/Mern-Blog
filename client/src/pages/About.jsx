const technologies = [
  "MongoDB",
  "Express.js",
  "React",
  "Node.js",
  "JavaScript",
  "Tailwind CSS",
];

function About() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Hero section */}
        <section className="mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            About this blog
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            A place to share ideas, explore technology, and keep learning.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Welcome! This blog is a personal project created to explore
            full-stack web development and build something practical with
            modern web technologies.
          </p>
        </section>

        {/* Story section */}
        <section className="grid gap-10 border-t border-gray-200 py-12 dark:border-gray-800 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
              The story behind it
            </h2>

            <div className="max-w-prose space-y-4 leading-8 text-gray-600 dark:text-gray-300">
              <p className="dark:text-gray-400">
                This was my first full-stack web development project. I built
                it while following a YouTube tutorial, which helped me
                understand how the frontend, backend, and database work
                together in a real application.
              </p>

              <p className="dark:text-gray-400">
                While working on it, I got practical exposure to React,
                Node.js, Express, MongoDB, authentication, and managing blog
                content. It also helped me understand how different parts of
                a web application communicate with each other.
              </p>

              <p className="dark:text-gray-400">
                The project is part of my learning journey. I plan to keep
                improving it as I learn more about development, UI design,
                and building applications independently.
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Project details
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Project type
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  Full-stack blog application
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Built with
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  MERN Stack
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Purpose
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  Learning and practical development
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* Technology section */}
        <section className="border-t border-gray-200 py-12 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Technologies used
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
            The application uses the MERN stack, along with other tools and
            technologies that helped me build and style the interface.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Closing section */}
        <section className="rounded-2xl bg-gray-900 px-7 py-10 text-white dark:border dark:border-gray-800 dark:bg-gray-900 sm:px-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Always learning
          </p>

          <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">
            Every project is an opportunity to learn something new.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-gray-300">
            This blog represents one of my first steps into full-stack
            development. There's always room to improve, and that's what
            makes building projects interesting.
          </p>
        </section>
      </div>
    </main>
  );
}

export default About;