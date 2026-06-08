"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/constants";

const navItems = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.settings, label: "Settings" },
] as const;

function navLinkClass(isActive: boolean): string {
  return isActive
    ? "text-sm font-medium text-zinc-900 dark:text-zinc-100"
    : "text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => {
        const isActive =
          item.href === ROUTES.dashboard
            ? pathname === ROUTES.dashboard
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={navLinkClass(isActive)}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
