"use client";

import { Button } from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <main className="bg-background text-foreground min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight leading-tight sm:text-6xl">
            Instant AI Code Reviews
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            CodeCoach helps developers improve code quality with meaningful,
            actionable feedback — instantly.
          </p>

          <div className="flex justify-center gap-4 flex-wrap pt-4">
            {isAuthenticated ? (
              <Link href="/review">
                <Button size="lg" variant="primary">
                  Review Your Code
                </Button>
              </Link>
            ) : (
              <Button size="lg" variant="primary" onClick={() => signIn()}>
                Sign In to Get Started
              </Button>
            )}

            <Link href="/features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Brand section with gradient */}
        <section className="rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg p-10 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Built for Real Developers</h2>
          <p className="max-w-xl mx-auto text-white/90 text-lg">
            Whether you&apos;re a junior learning best practices or a senior
            doing code review at scale, CodeCoach delivers clarity, speed, and
            results.
          </p>
        </section>

        {/* Theme toggle demo section */}
        <section className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Toggle Dark Mode</h3>
          <ThemeToggle />
        </section>
      </div>
    </main>
  );
}
