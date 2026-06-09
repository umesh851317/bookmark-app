"use client";

import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/types/database";

import { DeleteBookmarkButton } from "./delete-bookmark-button";
import { TogglePublicButton } from "./toggle-public-button";

type BookmarkCardProps = {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
};

function formatUrlDisplay(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  } catch {
    return url;
  }
}

export function BookmarkCard({ bookmark, onEdit }: BookmarkCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {bookmark.title}
              </a>
            </h3>
            <span
              className={
                bookmark.is_public
                  ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300"
                  : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }
            >
              {bookmark.is_public ? "Public" : "Private"}
            </span>
          </div>

          <p className="mt-1 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {formatUrlDisplay(bookmark.url)}
          </p>

          {bookmark.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {bookmark.description}
            </p>
          ) : null}

          {bookmark.tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button type="button" variant="secondary" onClick={() => onEdit(bookmark)}>
            Edit
          </Button>
          <TogglePublicButton bookmarkId={bookmark.id} isPublic={bookmark.is_public} />
          <DeleteBookmarkButton
            bookmarkId={bookmark.id}
            bookmarkTitle={bookmark.title}
          />
        </div>
      </div>
    </article>
  );
}
