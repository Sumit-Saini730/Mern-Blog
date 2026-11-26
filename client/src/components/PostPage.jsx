import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api.js";
import Spinner from "./Spinner.jsx";
import CallToAction from "./CallToAction.jsx";
import CommentSection from "./CommentSection.jsx";
import PostCard from "./PostCard.jsx";

function PostPage() {
  const { postSlug } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      setPost(null);

      try {
        const response = await api.get(
          `/api/v1/posts/getposts?slug=${encodeURIComponent(postSlug)}`
        );

        if (!isMounted) return;

        if (response.data.success === false) {
          setError(response.data.message || "Unable to load this article.");
          return;
        }

        const fetchedPost = response.data.data.posts?.[0];

        if (!fetchedPost) {
          setError("This article could not be found.");
          return;
        }

        setPost(fetchedPost);
      } catch (error) {
        if (!isMounted) return;

        setError(
          error.response?.data?.message ||
          "An error occurred while loading this article."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [postSlug]);

  useEffect(() => {
    let isMounted = true;

    const fetchRecentPosts = async () => {
      try {
        const response = await api.get("/api/v1/posts/getposts?limit=3");

        if (
          isMounted &&
          response.data.success === true
        ) {
          setRecentPosts(response.data.data.posts || []);
        }
      } catch (error) {
        console.error("Unable to fetch recent posts:", error);
      }
    };

    fetchRecentPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Article unavailable
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {error || "The article you're looking for doesn't exist."}
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  // Estimate reading time using approximately 200 words per minute.
  const plainText = post.content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();

  const wordCount = plainText
    ? plainText.split(/\s+/).length
    : 0;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  const otherRecentPosts = recentPosts.filter(
    (recentPost) => recentPost._id !== post._id
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">

      {/* Article header */}
      <article className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:pt-16">
        <header className="mx-auto max-w-3xl text-center">

          <Link
            to={`/search?category=${encodeURIComponent(post.category)}`}
            className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            {post.category}
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            {formattedDate && <span>{formattedDate}</span>}

            <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block" />

            <span>{readingTime} min read</span>
          </div>
        </header>

        {/* Featured image */}
        {post.image && (
          <div className="mt-10 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
            <img
              src={post.image}
              alt={post.title}
              className="max-h-[600px] w-full object-cover"
            />
          </div>
        )}

        {/* Article content */}
        <div
          className="post-content mx-auto mt-10 w-full max-w-3xl text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Call to action */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <CallToAction />
      </section>

      {/* Comments */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Join the discussion
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Share your thoughts or ask a question about this article.
            </p>
          </div>

          <CommentSection postId={post._id} />
        </div>
      </section>

      {/* Recent articles */}
      {otherRecentPosts.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 px-4 py-12 dark:border-gray-800 dark:bg-gray-900/40 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Keep exploring
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                Recent articles
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Discover more posts you might find interesting.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {otherRecentPosts.map((recentPost) => (
                <PostCard
                  key={recentPost._id}
                  post={recentPost}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default PostPage;
