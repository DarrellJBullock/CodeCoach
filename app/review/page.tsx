"use client";

import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { useSession } from "next-auth/react";
import ReviewForm from "@/components/ReviewForm";

export default function ReviewCodePage() {
  useRequireAuth(); // 🔐 protect the page

  const { data: session } = useSession();

  return (
    <div className="min-h-screen px-6 py-16 bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome, {session?.user?.name || "developer"} 👋
          </h1>
          <p className="text-muted-foreground">
            Paste your code snippet below to receive feedback.
          </p>
        </div>

        {/* 🧠 Your review component */}
        <ReviewForm />
      </div>
    </div>
  );
}
