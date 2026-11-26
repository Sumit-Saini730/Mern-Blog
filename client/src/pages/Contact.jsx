import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // This is a UI-only demo. No data is sent to a server.
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-16 text-gray-800 dark:bg-gray-950 dark:text-gray-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-12 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Get in touch
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Let's start a conversation.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600 dark:text-gray-400">
            Have a question, suggestion, or just want to connect? Feel free
            to reach out.
          </p>
        </section>

        <section className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:grid-cols-[0.8fr_1.2fr]">
          <aside className="bg-gray-900 p-7 text-white sm:p-10">
            <h2 className="text-2xl font-bold dark:text-gray-100 text-gray-100">Contact information</h2>

            <p className="mt-4 leading-7 text-gray-300">
              I'm always happy to connect with other developers, discuss
              ideas, or hear your feedback about this blog.
            </p>

            <div className="mt-10 space-y-7">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Email
                </p>
                <p className="mt-2 text-sm text-white">
                  Add your email address here
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400">
                  GitHub
                </p>
                <a
                  href="https://github.com/Sumit-Saini730"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-300 transition hover:text-blue-200"
                >
                  Visit my GitHub →
                </a>
              </div>
            </div>

            <div className="mt-16 border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-gray-400">
                Thanks for visiting my blog. I appreciate your time and
                feedback!
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="p-7 sm:p-10">
            <h2 className="text-2xl font-bold dark:text-gray-100">Send a message</h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill in the details below.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Your name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="5"
                  required
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Send message
              </button>

              {submitted && (
                <div
                  role="status"
                  className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  This is a demo contact form. Your message has not been
                  sent or stored because the form is not connected to a
                  backend yet.
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Contact;
