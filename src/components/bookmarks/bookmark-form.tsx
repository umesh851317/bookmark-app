"use client";

import { useActionState, useEffect } from "react";

import {
  createBookmark,
  updateBookmark,
  type BookmarkActionState,
} from "@/actions/bookmark";
import { BOOKMARK_LIMITS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Bookmark } from "@/types/database";

const initialState: BookmarkActionState = {};

type BookmarkFormProps = {
  mode: "create" | "edit";
  bookmark?: Bookmark;
  onCancel: () => void;
  onSuccess: () => void;
};

export function BookmarkForm({
  mode,
  bookmark,
  onCancel,
  onSuccess,
}: BookmarkFormProps) {
  const action = mode === "create" ? createBookmark : updateBookmark;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      onSuccess();
    }
  }, [state.message, onSuccess]);

  const tagsValue = bookmark?.tags.join(", ") ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {mode === "edit" && bookmark ? (
        <input type="hidden" name="id" value={bookmark.id} />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor={`bookmark-title-${mode}`}>Title</Label>
        <Input
          id={`bookmark-title-${mode}`}
          name="title"
          type="text"
          defaultValue={bookmark?.title ?? ""}
          maxLength={BOOKMARK_LIMITS.titleMax}
          required
          placeholder="My favorite article"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`bookmark-url-${mode}`}>URL</Label>
        <Input
          id={`bookmark-url-${mode}`}
          name="url"
          type="url"
          defaultValue={bookmark?.url ?? ""}
          required
          placeholder="https://example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`bookmark-description-${mode}`}>Description</Label>
        <textarea
          id={`bookmark-description-${mode}`}
          name="description"
          defaultValue={bookmark?.description ?? ""}
          maxLength={BOOKMARK_LIMITS.descriptionMax}
          rows={3}
          placeholder="Optional notes about this bookmark"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`bookmark-tags-${mode}`}>Tags</Label>
        <Input
          id={`bookmark-tags-${mode}`}
          name="tags"
          type="text"
          defaultValue={tagsValue}
          placeholder="react, typescript, design"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Comma-separated, up to {BOOKMARK_LIMITS.tagsMax} tags
        </p>
      </div>

      <div className="flex items-start gap-2">
        <input
          id={`bookmark-public-${mode}`}
          name="is_public"
          type="checkbox"
          defaultChecked={bookmark?.is_public ?? false}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-950"
        />
        <div>
          <Label htmlFor={`bookmark-public-${mode}`} className="cursor-pointer">
            Public
          </Label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Visible on your public profile page
          </p>
        </div>
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create bookmark"
              : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
