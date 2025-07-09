"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c++",
  "ruby",
  "go",
];

export default function ReviewForm() {
  const { data: session } = useSession();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!code.trim()) return;
    if (!session?.user?.id) {
      setError("You must be signed in to submit code.");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const res = await fetch("http://localhost:8000/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id, // 🔥 real user ID now
          code,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      toast.success("Review submitted!");
      setFeedback(data.feedback);
    } catch (err) {
      toast.error((err as Error).message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-semibold">
          Select Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold">
          Paste Your Code
        </label>
        <textarea
          rows={8}
          className="w-full border rounded-md px-3 py-2 font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Submitting..." : "Submit for Review"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {feedback && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">AI Feedback:</h2>
          <pre className="whitespace-pre-wrap text-sm">{feedback}</pre>
        </div>
      )}
    </div>
  );
}
