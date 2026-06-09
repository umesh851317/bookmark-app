import type { SupabaseClient } from "@supabase/supabase-js";

import type { Bookmark } from "@/types/database";

const BOOKMARK_SELECT =
  "id, user_id, title, url, description, tags, is_public, created_at, updated_at";

export async function getBookmarksByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select(BOOKMARK_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getBookmarkById(
  supabase: SupabaseClient,
  userId: string,
  bookmarkId: string,
): Promise<Bookmark | null> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select(BOOKMARK_SELECT)
    .eq("id", bookmarkId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function mapBookmarkError(message: string): string {
  if (message.includes("bookmarks_title_not_empty")) {
    return "Title is required";
  }

  if (message.includes("bookmarks_url_not_empty")) {
    return "URL is required";
  }

  if (message.includes("bookmarks_tags_max_count")) {
    return "You can add at most 20 tags";
  }

  return message;
}
