import { describe, expect, it } from "vitest";

import {
  categorySchema,
  languageSchema,
  loginSchema,
  subjectSchema,
} from "@/lib/validation";

describe("loginSchema", () => {
  it("accepts a non-empty username and password", () => {
    const result = loginSchema.safeParse({ username: "admin", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty username or password", () => {
    expect(loginSchema.safeParse({ username: "", password: "secret" }).success).toBe(false);
    expect(loginSchema.safeParse({ username: "admin", password: "" }).success).toBe(false);
  });
});

describe("categorySchema and subjectSchema", () => {
  it("trims whitespace and rejects a blank name", () => {
    const trimmed = categorySchema.parse({ name: "  Fiction  " });
    expect(trimmed.name).toBe("Fiction");
    expect(categorySchema.safeParse({ name: "   " }).success).toBe(false);
    expect(subjectSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects a name over 100 characters", () => {
    expect(categorySchema.safeParse({ name: "a".repeat(101) }).success).toBe(false);
  });
});

describe("languageSchema", () => {
  it("lowercases a valid 2-3 letter code", () => {
    const result = languageSchema.parse({ code: "EN", name: "English", rtl: false });
    expect(result.code).toBe("en");
  });

  it("rejects a code that isn't 2-3 letters", () => {
    expect(languageSchema.safeParse({ code: "english", name: "English", rtl: false }).success).toBe(false);
    expect(languageSchema.safeParse({ code: "1", name: "English", rtl: false }).success).toBe(false);
  });

  it("requires the rtl flag to be an explicit boolean", () => {
    expect(languageSchema.safeParse({ code: "ur", name: "Urdu" }).success).toBe(false);
  });
});
