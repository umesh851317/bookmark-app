"use client";

import { useFormStatus } from "react-dom";

import { deleteBookmark } from "@/actions/bookmark";
import { Button } from "@/components/ui/button";

type DeleteBookmarkButtonProps = {
  bookmarkId: string;
  bookmarkTitle: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" disabled={pending} className="text-red-600 dark:text-red-400">
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export function DeleteBookmarkButton({
  bookmarkId,
  bookmarkTitle,
}: DeleteBookmarkButtonProps) {
  return (
    <form
      action={deleteBookmark}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete "${bookmarkTitle}"? This cannot be undone.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={bookmarkId} />
      <SubmitButton />
    </form>
  );
}
