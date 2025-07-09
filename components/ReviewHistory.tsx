"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

type Review = {
  id: number;
  code: string;
  feedback: string;
  language: string;
  created_at: string;
};

export default function ReviewHistory() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return;

      const res = await fetch(
        `http://localhost:8000/api/reviews?user_id=${session.user.id}`
      );
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    };

    fetchReviews();
  }, [session]);

  if (!session?.user?.id) return null;
  if (loading) return <p className="mt-6 text-sm">Loading review history...</p>;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;

    const res = await fetch(
      `http://localhost:8000/api/review/${id}?user_id=${session.user.id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id.toString() !== id));
      toast.success("Review deleted");
    } else {
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((r) =>
    filter === "all" ? true : r.language === filter
  );

  return (
    <div className="mt-10">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Your Past Reviews</h2>

      <select
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded-md bg-muted"
      >
        <option value="all">All Languages</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="typescript">TypeScript</option>
      </select>

      <div className="space-y-4">
        {filteredReviews.map((r) => (
          <div
            key={r.id}
            className="relative group hover:shadow-lg transition rounded-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete(r.id.toString());
                }}
                className="absolute top-2 right-2 text-xs text-red-500 hover:underline z-10"
              >
                Delete
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {r.language} — {new Date(r.created_at).toLocaleString()}
              </p>

              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono line-clamp-4">
                {r.feedback}
              </pre>

              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
                  View submitted code
                </summary>
                <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-md font-mono whitespace-pre-wrap">
                  {r.code.slice(0, 500)}
                </pre>
              </details>
            </motion.div>

            <Link
              href={`/review/${r.id}`}
              className="absolute inset-0 z-0"
              aria-label="View full review"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
