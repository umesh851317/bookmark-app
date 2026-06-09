/** Application base URL for auth redirects and emails. */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  authCallback: "/api/auth/callback",
} as const;

/** Handles that cannot be claimed (conflict with app routes). */
export const RESERVED_HANDLES = new Set([
  "login",
  "signup",
  "dashboard",
  "settings",
  "api",
  "auth",
  "admin",
  "www",
  "app",
  "help",
  "support",
  "about",
  "privacy",
  "terms",
]);

export const BOOKMARK_LIMITS = {
  titleMax: 200,
  descriptionMax: 1000,
  tagsMax: 20,
  tagLengthMax: 30,
} as const;

export function publicProfilePath(handle: string): string {
  return `/${handle}`;
}

export function isAuthRoute(pathname: string): boolean {
  return pathname === ROUTES.login || pathname === ROUTES.signup;
}

export function isProtectedRoute(pathname: string): boolean {
  return pathname === ROUTES.dashboard || pathname.startsWith(`${ROUTES.dashboard}/`);
}
