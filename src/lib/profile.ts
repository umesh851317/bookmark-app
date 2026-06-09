import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

import { handleSchema, normalizeHandle } from "@/lib/validations/profile";
import type { Profile } from "@/types/database";

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function isHandleAvailable(
  supabase: SupabaseClient,
  handle: string,
  excludeUserId?: string,
): Promise<boolean> {
  const normalized = normalizeHandle(handle);

  let query = supabase
    .from("profiles")
    .select("id")
    .eq("handle", normalized);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data === null;
}

export async function createProfile(
  supabase: SupabaseClient,
  userId: string,
  handle: string,
): Promise<Profile> {
  const parsed = handleSchema.safeParse(handle);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid handle";
    throw new Error(message);
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: userId, handle: parsed.data })
    .select("id, handle, display_name, created_at, updated_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("This handle is already taken");
    }

    throw new Error(error.message);
  }

  return data;
}

export async function getProfileByHandle(
  supabase: SupabaseClient,
  handle: string,
): Promise<Profile | null> {
  const { normalizeHandle } = await import("@/lib/validations/profile");
  const normalized = normalizeHandle(handle);

  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, created_at, updated_at")
    .eq("handle", normalized)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/** Creates a profile from signup metadata when the user gains a session. */
export async function ensureProfileFromUser(
  supabase: SupabaseClient,
  user: User,
): Promise<Profile | null> {
  const existing = await getProfileByUserId(supabase, user.id);

  if (existing) {
    return existing;
  }

  const handle = user.user_metadata?.handle;

  if (typeof handle !== "string" || !handle.trim()) {
    return null;
  }

  try {
    return await createProfile(supabase, user.id, handle);
  } catch {
    return null;
  }
}

export function mapProfileError(message: string): string {
  if (message.includes("profiles_handle_format")) {
    return "Use 3–30 lowercase letters, numbers, and underscores only";
  }

  if (message.includes("duplicate") || message.includes("already taken")) {
    return "This handle is already taken";
  }

  return message;
}
