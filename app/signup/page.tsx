"use client";

import { useAuthRedirect } from "@/app/hooks/useAuthRedirect";

export default function SignupPage() {
  useAuthRedirect(); // ⬅️ Will redirect if already signed in

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <h1 className="text-3xl font-bold">Create Your Account</h1>
      <p className="text-muted-foreground mt-2">
        Sign up to get started with CodeCoach.
      </p>
    </div>
  );
}
