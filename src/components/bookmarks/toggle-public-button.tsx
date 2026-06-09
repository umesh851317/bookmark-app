"use client";

import { useFormStatus } from "react-dom";

import { toggleBookmarkPublic } from "@/actions/bookmark";
import { Button } from "@/components/ui/button";

type TogglePublicButtonProps = {
  bookmarkId: string;
  isPublic: boolean;
};

function SubmitButton({ isPublic }: { isPublic: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "Updating..." : isPublic ? "Make private" : "Make public"}
    </Button>
  );
}

export function TogglePublicButton({
  bookmarkId,
  isPublic,
}: TogglePublicButtonProps) {
  return (
    <form action={toggleBookmarkPublic}>
      <input type="hidden" name="id" value={bookmarkId} />
      <input type="hidden" name="is_public" value={String(!isPublic)} />
      <SubmitButton isPublic={isPublic} />
    </form>
  );
}
