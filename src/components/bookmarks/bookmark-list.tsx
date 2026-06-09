"use client";

import type { Bookmark } from "@/types/database";

import { BookmarkCard } from "./bookmark-card";

type BookmarkListProps = {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
};

export function BookmarkList({ bookmarks, onEdit }: BookmarkListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <BookmarkCard bookmark={bookmark} onEdit={onEdit} />
        </li>
      ))}
    </ul>
  );
}
