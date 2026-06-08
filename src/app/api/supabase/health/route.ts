import { NextResponse } from "next/server";

import { getMissingSupabaseEnvVars } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const missing = getMissingSupabaseEnvVars();

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Supabase environment variables",
        missing,
        hint: "Copy .env.example to .env.local and add your Supabase project credentials.",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Supabase request failed",
          message: error.message,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Connected to Supabase",
      session: data.session ? "active" : "none",
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to initialize Supabase client",
        message,
      },
      { status: 500 },
    );
  }
}
