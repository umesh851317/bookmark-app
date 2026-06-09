import { z } from "zod";

import { BOOKMARK_LIMITS } from "@/lib/constants";

const HTTP_URL_REGEX = /^https?:\/\/.+/i;

export function parseTagsInput(raw: string | null | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const part of raw.split(",")) {
    const tag = part.trim().toLowerCase();

    if (!tag || seen.has(tag)) {
      continue;
    }

    seen.add(tag);
    tags.push(tag);
  }

  return tags;
}

function parseIsPublic(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

const titleSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .min(1, "Title is required")
      .max(
        BOOKMARK_LIMITS.titleMax,
        `Title must be at most ${BOOKMARK_LIMITS.titleMax} characters`,
      ),
  );

const urlSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .min(1, "URL is required")
      .regex(HTTP_URL_REGEX, "URL must start with http:// or https://"),
  );

const descriptionSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .max(
        BOOKMARK_LIMITS.descriptionMax,
        `Description must be at most ${BOOKMARK_LIMITS.descriptionMax} characters`,
      ),
  );

const tagsSchema = z
  .string()
  .transform(parseTagsInput)
  .pipe(
    z
      .array(
        z
          .string()
          .min(1, "Tags cannot be empty")
          .max(
            BOOKMARK_LIMITS.tagLengthMax,
            `Each tag must be at most ${BOOKMARK_LIMITS.tagLengthMax} characters`,
          ),
      )
      .max(
        BOOKMARK_LIMITS.tagsMax,
        `You can add at most ${BOOKMARK_LIMITS.tagsMax} tags`,
      ),
  );

const bookmarkFieldsSchema = z.object({
  title: titleSchema,
  url: urlSchema,
  description: descriptionSchema.optional().transform((value) => value || null),
  tags: tagsSchema,
  is_public: z.boolean(),
});

export const createBookmarkSchema = bookmarkFieldsSchema;

export const updateBookmarkSchema = bookmarkFieldsSchema.extend({
  id: z.string().uuid("Invalid bookmark"),
});

export const deleteBookmarkSchema = z.object({
  id: z.string().uuid("Invalid bookmark"),
});

export const toggleBookmarkPublicSchema = z.object({
  id: z.string().uuid("Invalid bookmark"),
  is_public: z.boolean(),
});

export function parseCreateBookmarkFormData(formData: FormData) {
  return createBookmarkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") ?? "",
    tags: formData.get("tags") ?? "",
    is_public: parseIsPublic(formData.get("is_public")),
  });
}

export function parseUpdateBookmarkFormData(formData: FormData) {
  return updateBookmarkSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") ?? "",
    tags: formData.get("tags") ?? "",
    is_public: parseIsPublic(formData.get("is_public")),
  });
}

export function parseDeleteBookmarkFormData(formData: FormData) {
  return deleteBookmarkSchema.safeParse({
    id: formData.get("id"),
  });
}

export function parseToggleBookmarkPublicFormData(formData: FormData) {
  return toggleBookmarkPublicSchema.safeParse({
    id: formData.get("id"),
    is_public: formData.get("is_public") === "true",
  });
}

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
