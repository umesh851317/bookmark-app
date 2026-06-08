import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { buttonClassName } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Bookmark Manager
          </span>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href={ROUTES.dashboard} className={buttonClassName()}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href={ROUTES.login} className={buttonClassName("ghost")}>
                  Sign in
                </Link>
                <Link href={ROUTES.signup} className={buttonClassName()}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Save, organize, and share your bookmarks
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            A simple bookmark manager with public profiles and private collections.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link href={ROUTES.dashboard} className={buttonClassName()}>
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link href={ROUTES.signup} className={buttonClassName()}>
                  Get started
                </Link>
                <Link href={ROUTES.login} className={buttonClassName("secondary")}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
