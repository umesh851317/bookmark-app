import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app/app-header";
import { ROUTES } from "@/lib/constants";
import { ensureProfileFromUser, getProfileByUserId } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  let profile = await getProfileByUserId(supabase, user.id);

  if (!profile) {
    profile = await ensureProfileFromUser(supabase, user);
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppHeader profile={profile} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
