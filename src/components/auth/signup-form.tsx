"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { signUp, type AuthActionState } from "@/actions/auth";
import { getAppUrl, ROUTES } from "@/lib/constants";
import { normalizeHandle } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [handlePreview, setHandlePreview] = useState("");

  const previewHandle = normalizeHandle(handlePreview) || "your_handle";
  const profileUrl = `${getAppUrl()}/${previewHandle}`;

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="handle">Handle</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">@</span>
          <Input
            id="handle"
            name="handle"
            type="text"
            autoComplete="username"
            placeholder="jane_dev"
            pattern="[a-zA-Z0-9_]{3,30}"
            minLength={3}
            maxLength={30}
            required
            onChange={(event) => setHandlePreview(event.target.value)}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          3–30 characters: lowercase letters, numbers, and underscores. Your
          public page:{" "}
          <span className="font-mono text-zinc-700 dark:text-zinc-300">
            {profileUrl}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
