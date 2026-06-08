"use client";

import { useActionState } from "react";

import { updateHandle, type ProfileActionState } from "@/actions/profile";
import { getAppUrl, publicProfilePath } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types/database";

const initialState: ProfileActionState = {};

type SettingsFormProps = {
  profile: Profile | null;
  email: string;
};

export function SettingsForm({ profile, email }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateHandle, initialState);
  const handle = profile?.handle ?? "";
  const profileUrl = `${getAppUrl()}${publicProfilePath(handle || "your_handle")}`;

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex flex-col gap-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Public profile
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Your handle appears on your public profile page.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Label htmlFor="handle">Handle</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">@</span>
                <Input
                  id="handle"
                  name="handle"
                  type="text"
                  defaultValue={handle}
                  autoComplete="username"
                  placeholder="jane_dev"
                  pattern="[a-zA-Z0-9_]{3,30}"
                  minLength={3}
                  maxLength={30}
                  required
                />
              </div>
              <Button type="submit" disabled={pending} className="sm:w-auto">
                {pending ? "Saving..." : profile ? "Save changes" : "Save handle"}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Public page:{" "}
              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                {profileUrl}
              </span>
            </p>
          </div>

          {state.error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {state.error}
            </p>
          ) : null}

          {state.message ? (
            <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
              {state.message}
            </p>
          ) : null}
        </div>
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Account
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Email address used to sign in.
        </p>

        <div className="mt-6">
          <Label>Email</Label>
          <p className="mt-2 text-sm text-zinc-900 dark:text-zinc-100">{email}</p>
        </div>
      </div>
    </div>
  );
}
