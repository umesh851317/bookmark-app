import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Bookmark Manager",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackError =
    params.error === "auth_callback_failed"
      ? "Email confirmation failed. Try signing in or request a new link."
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to manage your bookmarks
        </p>
      </div>

      <LoginForm callbackError={callbackError} />
    </div>
  );
}
