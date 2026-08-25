import { describe, expect, it } from "vitest";

import { dirForLocale, isRtlLocale, localeMeta } from "@/lib/locales";

describe("locale direction metadata", () => {
  it("marks Urdu, Sindhi, Farsi, and Arabic as RTL", () => {
    expect(isRtlLocale("ur")).toBe(true);
    expect(isRtlLocale("sd")).toBe(true);
    expect(isRtlLocale("fa")).toBe(true);
    expect(isRtlLocale("ar")).toBe(true);
  });

  it("marks English as LTR", () => {
    expect(isRtlLocale("en")).toBe(false);
  });

  it("defaults an unknown locale to LTR rather than throwing", () => {
    expect(isRtlLocale("xx")).toBe(false);
  });

  it("derives the dir attribute from the RTL flag", () => {
    expect(dirForLocale("ar")).toBe("rtl");
    expect(dirForLocale("en")).toBe("ltr");
  });

  it("has metadata for exactly the five supported locales", () => {
    expect(Object.keys(localeMeta).sort()).toEqual(
      ["ar", "en", "fa", "sd", "ur"].sort(),
    );
  });
});
