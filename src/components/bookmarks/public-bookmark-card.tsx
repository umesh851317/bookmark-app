import type { Bookmark } from "@/types/database";

type PublicBookmarkCardProps = {
  bookmark: Bookmark;
};

function formatUrlDisplay(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  } catch {
    return url;
  }
}

export function PublicBookmarkCard({ bookmark }: PublicBookmarkCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3">
        <div className="min-w-0 flex-1">
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

          <p className="mt-1 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {formatUrlDisplay(bookmark.url)}
          </p>

          {bookmark.description && (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
              {bookmark.description}
            </p>
          )}

          {bookmark.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        Saved {new Date(bookmark.created_at).toLocaleDateString()}
      </p>
    </article>
  );
}
