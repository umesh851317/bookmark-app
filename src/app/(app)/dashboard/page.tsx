import type { Metadata } from "next";
import Link from "next/link";

import { BookmarksSection } from "@/components/bookmarks/bookmarks-section";
import { buttonClassName } from "@/components/ui/button";
import { getBookmarksByUserId } from "@/lib/bookmark";
import { getAppUrl, publicProfilePath, ROUTES } from "@/lib/constants";
import { getProfileByUserId } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | Bookmark Manager",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfileByUserId(supabase, user.id) : null;
  const bookmarks = user ? await getBookmarksByUserId(supabase, user.id) : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {profile ? (
            <>
              Welcome back,{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                @{profile.handle}
              </span>
            </>
          ) : (
            "Complete your profile to get a public page."
          )}
        </p>
      </div>

      {!profile ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          You haven&apos;t set a handle yet.{" "}
          <Link
            href={ROUTES.settings}
            className="font-medium underline underline-offset-2"
          >
            Add one in Settings
          </Link>
          .
        </div>
      ) : null}

      <BookmarksSection bookmarks={bookmarks} />

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          Public profile
        </h2>
        {profile ? (
          <>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Your bookmarks marked public will appear at your profile page.
            </p>
            <p className="mt-3 font-mono text-sm text-zinc-800 dark:text-zinc-200">
              {getAppUrl()}
              {publicProfilePath(profile.handle)}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={publicProfilePath(profile.handle)}
                className={buttonClassName("secondary")}
              >
                View profile
              </Link>
              <Link
                href={ROUTES.settings}
                className={buttonClassName("ghost")}
              >
                Edit handle
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Choose a unique handle to enable your public profile page.
            </p>
            <Link href={ROUTES.settings} className={`mt-4 ${buttonClassName()}`}>
              Set up profile
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
