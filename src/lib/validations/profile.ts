import { z } from "zod";

import { RESERVED_HANDLES } from "@/lib/constants";

const HANDLE_REGEX = /^[a-z0-9_]{3,30}$/;

export function normalizeHandle(value: string): string {
  return value.trim().toLowerCase();
}

export const handleSchema = z
  .string()
  .transform(normalizeHandle)
  .pipe(
    z
      .string()
      .min(3, "Handle must be at least 3 characters")
      .max(30, "Handle must be at most 30 characters")
      .regex(
        HANDLE_REGEX,
        "Use lowercase letters, numbers, and underscores only",
      )
      .refine((handle) => !RESERVED_HANDLES.has(handle), {
        message: "This handle is not available",
      }),
  );

export type HandleInput = z.infer<typeof handleSchema>;
