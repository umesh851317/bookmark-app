"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAppUrl, ROUTES } from "@/lib/constants";
import {
  createProfile,
  isHandleAvailable,
  mapProfileError,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  message?: string;
};

function formatZodError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.dashboard);
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    handle: formData.get("handle"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const supabase = await createClient();

  const handleAvailable = await isHandleAvailable(supabase, parsed.data.handle);

  if (!handleAvailable) {
    return { error: "This handle is already taken" };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getAppUrl()}${ROUTES.authCallback}`,
      data: {
        handle: parsed.data.handle,
      },
    },
  });

  if (error) {
    if (error.message === "User already registered") {
      return {
        error: "An account with this email already exists. Please sign in.",
      };
    }

    return { error: error.message };
  }

  if (data.user?.identities?.length === 0) {
    return {
      error: "An account with this email already exists. Please sign in.",
    };
  }

  if (data.session && data.user) {
    try {
      await createProfile(supabase, data.user.id, parsed.data.handle);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create profile";

      return { error: mapProfileError(message) };
    }

    revalidatePath("/", "layout");
    redirect(ROUTES.dashboard);
  }

  return {
    message:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect(ROUTES.login);
}
