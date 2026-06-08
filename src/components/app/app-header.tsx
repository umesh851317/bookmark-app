import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { AppNav } from "@/components/app/app-nav";
import { getAppUrl, publicProfilePath, ROUTES } from "@/lib/constants";
import type { Profile } from "@/types/database";

type AppHeaderProps = {
  profile: Profile | null;
};

export function AppHeader({ profile }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href={ROUTES.dashboard}
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Bookmark Manager
          </Link>
          <AppNav />
        </div>

        <div className="flex items-center gap-3">
          {profile ? (
            <Link
              href={publicProfilePath(profile.handle)}
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              title={`${getAppUrl()}${publicProfilePath(profile.handle)}`}
            >
              @{profile.handle}
            </Link>
          ) : (
            <Link
              href={ROUTES.settings}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Set handle
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
