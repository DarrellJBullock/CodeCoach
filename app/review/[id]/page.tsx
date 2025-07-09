import { notFound } from "next/navigation";
import Link from "next/link";
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

export default async function ReviewDetailPage({ params }: PageProps) {
  const res = await fetch(
    `https://your-backend-url.com/api/review/${params.id}`,
    {
      cache: "no-store", // optional: always get fresh data
    }
  );

  if (!res.ok) return notFound();

  const review: Review = await res.json();

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
        <form
          action={() => {
            navigator.clipboard.writeText(review.feedback);
          }}
        >
          <Button type="submit" variant="secondary">
            📋 Copy Feedback
          </Button>
        </form>

        <form
          action={() => {
            const blob = new Blob([markdown], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `codecoach-review-${review.id}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Button type="submit" variant="outline">
            📄 Export to Markdown
          </Button>
        </form>

        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
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
