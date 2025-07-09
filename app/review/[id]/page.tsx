"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";

type PageProps = {
  params: { id: string };
};

type Review = {
  id: number;
  code: string;
  feedback: string;
  language: string;
  created_at: string;
  model?: string;
};

export default function ReviewDetailPage({ params }: PageProps) {
  const [review, setReview] = useState<Review | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReview = async () => {
      const res = await fetch(`http://localhost:8000/api/review/${params.id}`);
      if (!res.ok) return notFound();

      const data = await res.json();
      setReview(data);
    };

    fetchReview();
  }, [params.id]);

  if (!review) return <p className="p-6 text-sm">Loading...</p>;

  const downloadMarkdown = () => {
    const markdown = `# CodeCoach Review

**Language:** ${review.language}  
**Model:** ${review.model || "GPT-4"}  
**Date:** ${new Date(review.created_at).toLocaleString()}

---

## 🧠 AI Feedback

\`\`\`
${review.feedback}
\`\`\`

---

## 💻 Submitted Code

\`\`\`${review.language}
${review.code}
\`\`\`
`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codecoach-review-${review.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyFeedback = async () => {
    await navigator.clipboard.writeText(review.feedback);
    alert("Feedback copied to clipboard!");
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-foreground">
      <h1 className="text-2xl font-bold mb-2">Review Details</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {review.language} — {new Date(review.created_at).toLocaleString()}
        {review.model && (
          <span className="ml-2 px-2 py-0.5 bg-muted text-xs rounded-full">
            Model: {review.model}
          </span>
        )}
      </p>

      <div className="flex gap-3 mb-6 flex-wrap">
        <Button onClick={copyFeedback} variant="secondary">
          📋 Copy Feedback
        </Button>
        <Button onClick={downloadMarkdown} variant="outline">
          📄 Export to Markdown
        </Button>
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          ← Back to Dashboard
        </Button>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">💬 AI Feedback</h2>
        <pre className="bg-muted p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
          {review.feedback}
        </pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">💻 Submitted Code</h2>
        <pre className="bg-muted p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
          {review.code}
        </pre>
      </section>
    </main>
  );
}
