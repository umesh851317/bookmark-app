"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/types/database";

import { BookmarkEmptyState } from "./bookmark-empty-state";
import { BookmarkForm } from "./bookmark-form";
import { BookmarkList } from "./bookmark-list";

type BookmarksSectionProps = {
  bookmarks: Bookmark[];
};

export function BookmarksSection({ bookmarks }: BookmarksSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingBookmark(null);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingBookmark(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setFormOpen(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    closeForm();
  }, [closeForm]);

  const formMode = editingBookmark ? "edit" : "create";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            Bookmarks
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {bookmarks.length === 0
              ? "Create and manage your saved links."
              : `${bookmarks.length} bookmark${bookmarks.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {bookmarks.length > 0 ? (
          <Button
            type="button"
            variant={formOpen && formMode === "create" ? "secondary" : "primary"}
            onClick={() => {
              if (formOpen && formMode === "create") {
                closeForm();
              } else {
                handleAdd();
              }
            }}
          >
            {formOpen && formMode === "create" ? "Cancel" : "Add bookmark"}
          </Button>
        ) : null}
      </div>

      {formOpen ? (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-950/50">
          <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formMode === "create" ? "New bookmark" : "Edit bookmark"}
          </h3>
          <BookmarkForm
            key={editingBookmark?.id ?? "create"}
            mode={formMode}
            bookmark={editingBookmark ?? undefined}
            onCancel={closeForm}
            onSuccess={handleFormSuccess}
          />
        </div>
      ) : null}

      <div className="mt-6">
        {bookmarks.length === 0 && !formOpen ? (
          <BookmarkEmptyState onAdd={handleAdd} />
        ) : bookmarks.length > 0 ? (
          <BookmarkList bookmarks={bookmarks} onEdit={handleEdit} />
        ) : null}
      </div>
    </section>
  );
}
