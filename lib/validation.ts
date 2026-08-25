import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
});

export const categorySchema = nameSchema;
export const subjectSchema = nameSchema;

export const languageSchema = z.object({
  code: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z]{2,3}$/, "Use a 2-3 letter language code (e.g. en, ur, sd)"),
  name: z.string().trim().min(1, "Name is required").max(100),
  rtl: z.boolean(),
});

export const renameLanguageSchema = languageSchema.omit({ code: true });
