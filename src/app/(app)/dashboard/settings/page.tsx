import type { Metadata } from "next";

import { SettingsForm } from "@/components/profile/settings-form";
import { getProfileByUserId } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Settings | Bookmark Manager",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfileByUserId(supabase, user.id) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Manage your public profile and account details.
        </p>
      </div>

      {user ? (
        <SettingsForm profile={profile} email={user.email ?? ""} />
      ) : null}
    </div>
  );
}
