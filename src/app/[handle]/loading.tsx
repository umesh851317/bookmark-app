export default function PublicProfileLoadingPage() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-2/3 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-1/3 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Bookmarks section header */}
      <div className="h-6 w-1/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />

      {/* Bookmark cards skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="space-y-3">
              <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
