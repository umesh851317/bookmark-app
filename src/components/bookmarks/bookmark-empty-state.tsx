"use client";

import { Button } from "@/components/ui/button";

type BookmarkEmptyStateProps = {
  onAdd: () => void;
};

export function BookmarkEmptyState({ onAdd }: BookmarkEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-950/50">
      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
        No bookmarks yet
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Save links you want to revisit. Add a title, URL, and optional tags.
      </p>
      <Button type="button" className="mt-6" onClick={onAdd}>
        Add your first bookmark
      </Button>
    </div>
  );
}
