"use client";

import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { useSession } from "next-auth/react";
import ReviewHistory from "@/components/ReviewHistory";

export default function DashboardPage() {
  useRequireAuth();

  const { data: session } = useSession();

  return (
    <div className="min-h-screen px-6 py-16 bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Welcome */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name || "developer"} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here’s your recent code review history.
          </p>
        </section>

        {/* Review History */}
        <ReviewHistory />
      </div>
    </div>
  );
}
