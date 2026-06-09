"use server";

import { revalidatePath } from "next/cache";

import { getBookmarkById, mapBookmarkError } from "@/lib/bookmark";
import { ROUTES, publicProfilePath } from "@/lib/constants";
import { getProfileByUserId } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import {
  parseCreateBookmarkFormData,
  parseDeleteBookmarkFormData,
  parseToggleBookmarkPublicFormData,
  parseUpdateBookmarkFormData,
} from "@/lib/validations/bookmark";

export type BookmarkActionState = {
  error?: string;
  message?: string;
};

function formatZodError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}

async function revalidateBookmarkPaths(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  isPublic: boolean,
) {
  revalidatePath(ROUTES.dashboard);

  if (!isPublic) {
    return;
  }

  const profile = await getProfileByUserId(supabase, userId);

  if (profile?.handle) {
    revalidatePath(publicProfilePath(profile.handle));
  }
}

export async function createBookmark(
  _prevState: BookmarkActionState,
  formData: FormData,
): Promise<BookmarkActionState> {
  const parsed = parseCreateBookmarkFormData(formData);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a bookmark" };
  }

  const { title, url, description, tags, is_public } = parsed.data;

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    title,
    url,
    description,
    tags,
    is_public,
  });

  if (error) {
    return { error: mapBookmarkError(error.message) };
  }

  await revalidateBookmarkPaths(supabase, user.id, is_public);

  return { message: "Bookmark created" };
}

export async function updateBookmark(
  _prevState: BookmarkActionState,
  formData: FormData,
): Promise<BookmarkActionState> {
  const parsed = parseUpdateBookmarkFormData(formData);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update a bookmark" };
  }

  const { id, title, url, description, tags, is_public } = parsed.data;
  const existing = await getBookmarkById(supabase, user.id, id);

  if (!existing) {
    return { error: "Bookmark not found" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ title, url, description, tags, is_public })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: mapBookmarkError(error.message) };
  }

  await revalidateBookmarkPaths(
    supabase,
    user.id,
    is_public || existing.is_public,
  );

  return { message: "Bookmark updated" };
}

export async function deleteBookmark(formData: FormData): Promise<void> {
  const parsed = parseDeleteBookmarkFormData(formData);

  if (!parsed.success) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const existing = await getBookmarkById(supabase, user.id, parsed.data.id);

  if (!existing) {
    return;
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    return;
  }

  await revalidateBookmarkPaths(supabase, user.id, existing.is_public);
}

export async function toggleBookmarkPublic(formData: FormData): Promise<void> {
  const parsed = parseToggleBookmarkPublicFormData(formData);

  if (!parsed.success) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const existing = await getBookmarkById(supabase, user.id, parsed.data.id);

  if (!existing) {
    return;
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ is_public: parsed.data.is_public })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    return;
  }

  await revalidateBookmarkPaths(
    supabase,
    user.id,
    parsed.data.is_public || existing.is_public,
  );
}
