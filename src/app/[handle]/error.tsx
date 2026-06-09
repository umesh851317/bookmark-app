"use client";

import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PublicProfileErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          We couldn't load this profile. Please try again.
        </p>

        {error.message && (
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Error: {error.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={reset} className={buttonClassName()}>
          Try again
        </button>

        <Link href={ROUTES.home} className={buttonClassName("secondary")}>
          Go home
        </Link>
      </div>
    </div>
  );
}
