import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up | Bookmark Manager",
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Create an account
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Start saving and sharing your bookmarks
        </p>
      </div>

      <SignupForm />
    </div>
  );
}
