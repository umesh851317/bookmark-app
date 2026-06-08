"use server";

import { revalidatePath } from "next/cache";

import { ROUTES, publicProfilePath } from "@/lib/constants";
import {
  createProfile,
  getProfileByUserId,
  isHandleAvailable,
  mapProfileError,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { handleSchema } from "@/lib/validations/profile";

export type ProfileActionState = {
  error?: string;
  message?: string;
};

function formatZodError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}

export async function updateHandle(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = handleSchema.safeParse(formData.get("handle"));

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update your handle" };
  }

  const handle = parsed.data;
  const existing = await getProfileByUserId(supabase, user.id);

  if (existing?.handle === handle) {
    return { message: "Handle is unchanged" };
  }

  const available = await isHandleAvailable(supabase, handle, user.id);

  if (!available) {
    return { error: "This handle is already taken" };
  }

  try {
    if (existing) {
      const { error } = await supabase
        .from("profiles")
        .update({ handle })
        .eq("id", user.id);

      if (error) {
        return { error: mapProfileError(error.message) };
      }
    } else {
      await createProfile(supabase, user.id, handle);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update handle";
    return { error: mapProfileError(message) };
  }

  revalidatePath(ROUTES.dashboard);
  revalidatePath(ROUTES.settings);
  revalidatePath(publicProfilePath(handle));

  if (existing?.handle) {
    revalidatePath(publicProfilePath(existing.handle));
  }

  return { message: "Handle updated successfully" };
}
