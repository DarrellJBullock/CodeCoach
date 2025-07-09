"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="w-full sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary tracking-tight"
        >
          CodeCoach
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#">Features</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">About</Link>
          <Link href="#">Contact</Link>
          {isAuthenticated && <Link href="/dashboard">Dashboard</Link>}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="btn btn-outline text-sm"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="btn btn-outline text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
