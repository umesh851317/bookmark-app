"use client";

import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
      <h2 className="text-lg font-medium text-red-900 dark:text-red-200">
        Couldn&apos;t load dashboard
      </h2>
      <p className="text-sm text-red-800 dark:text-red-300">
        {error.message || "Something went wrong while loading your bookmarks."}
      </p>
      <div>
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
