import { z } from 'zod';

/**
 * Safely parse JSON from localStorage with zod schema validation.
 * Returns fallback value if parsing or validation fails.
 */
export function safeJsonParse<T>(json: string, schema: z.ZodSchema<T>, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}

// Reusable schemas
export const ProfileSchema = z.object({
  name: z.string().max(100).default('Student'),
  grade: z.number().int().min(1).max(12).default(3),
});

export const AccessibilitySchema = z.object({
  fontSize: z.enum(["100", "125", "150"]),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  dyslexiaFont: z.boolean(),
  screenReaderAnnouncements: z.boolean(),
});
