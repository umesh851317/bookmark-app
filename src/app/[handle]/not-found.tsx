import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function PublicProfileNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Profile not found
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          The profile you're looking for doesn't exist or is not publicly accessible.
        </p>
      </div>

      <Link href={ROUTES.home} className={buttonClassName()}>
        Go home
      </Link>
    </div>
  );
}
