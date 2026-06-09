import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicBookmarkCard } from "@/components/bookmarks/public-bookmark-card";
import { RESERVED_HANDLES } from "@/lib/constants";
import { getPublicBookmarksByUserId } from "@/lib/bookmark";
import { getProfileByHandle } from "@/lib/profile";
import { normalizeHandle } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/server";

type PublicProfilePageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const normalized = normalizeHandle(handle);

  // Check for reserved handles
  if (RESERVED_HANDLES.has(normalized)) {
    return { title: "Not Found" };
  }

  const supabase = await createClient();
  const profile = await getProfileByHandle(supabase, handle);

  if (!profile) {
    return { title: "Not Found" };
  }

  const displayName = profile.display_name || `@${profile.handle}`;
  return {
    title: `${displayName} | Bookmarks`,
    description: `Public bookmarks by ${displayName}`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { handle } = await params;
  const normalized = normalizeHandle(handle);

  // Check for reserved handles
  if (RESERVED_HANDLES.has(normalized)) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch profile
  const profile = await getProfileByHandle(supabase, handle);

  if (!profile) {
    notFound();
  }

  // Optionally get current user for owner banner
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === profile.id;

  // Fetch public bookmarks
  const bookmarks = await getPublicBookmarksByUserId(supabase, profile.id);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        {isOwner && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
            This is your public profile.
          </div>
        )}

        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            {profile.display_name || `@${profile.handle}`}
          </h1>

          {profile.display_name && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              @{profile.handle}
            </p>
          )}

          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {bookmarks.length} public {bookmarks.length === 1 ? "bookmark" : "bookmarks"}
          </p>
        </div>
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Public Bookmarks
          </h2>

          <ul className="flex flex-col gap-4">
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <PublicBookmarkCard bookmark={bookmark} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-950/50">
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            No public bookmarks
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {isOwner
              ? "You haven't shared any bookmarks yet. Mark some as public to share them."
              : "This profile doesn't have any public bookmarks yet."}
          </p>
        </div>
      )}
    </div>
  );
}
