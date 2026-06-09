import Link from "next/link";

import { ROUTES } from "@/lib/constants";

export default function PublicProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          href={ROUTES.home}
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Bookmark Manager
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
