import { NextResponse } from "next/server";

import { ROUTES } from "@/lib/constants";
import { ensureProfileFromUser } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

/**
 * Exchanges the email-confirmation (or OAuth) code for a Supabase session.
 * Add this URL to Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? ROUTES.dashboard;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await ensureProfileFromUser(supabase, data.user);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL(ROUTES.login, origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");

  return NextResponse.redirect(loginUrl);
}
