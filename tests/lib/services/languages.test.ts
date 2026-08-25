import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { DuplicateNameError, InUseError } from "@/lib/errors";
import {
  createLanguage,
  deleteLanguage,
  listLanguages,
  renameLanguage,
} from "@/lib/services/languages";

const createdLanguageIds: string[] = [];
const createdBookIds: string[] = [];

afterEach(async () => {
  await prisma.book.deleteMany({ where: { id: { in: createdBookIds } } });
  await prisma.language.deleteMany({ where: { id: { in: createdLanguageIds } } });
  createdBookIds.length = 0;
  createdLanguageIds.length = 0;
});

describe("language taxonomy service", () => {
  it("creates a language and lists it with a zero book count", async () => {
    // Code normalization (lowercasing) is the Zod schema's job - see
    // tests/lib/validation.test.ts - the service just persists what it's given.
    const language = await createLanguage({ code: "tl", name: "Test Language", rtl: false });
    createdLanguageIds.push(language.id);

    const languages = await listLanguages();
    const found = languages.find((l) => l.id === language.id);
    expect(found?.bookCount).toBe(0);
  });

  it("rejects creating a duplicate code", async () => {
    const language = await createLanguage({ code: "td", name: "Test Dup", rtl: false });
    createdLanguageIds.push(language.id);

    await expect(
      createLanguage({ code: "td", name: "Test Dup Again", rtl: false }),
    ).rejects.toBeInstanceOf(DuplicateNameError);
  });

  it("renames a language and can flip its rtl flag", async () => {
    const language = await createLanguage({ code: "tr2", name: "Test Rename", rtl: false });
    createdLanguageIds.push(language.id);

    const renamed = await renameLanguage(language.id, { name: "Test Renamed", rtl: true });
    expect(renamed.name).toBe("Test Renamed");
    expect(renamed.rtl).toBe(true);
  });

  it("deletes an unused language", async () => {
    const language = await createLanguage({ code: "tu", name: "Test Unused", rtl: false });
    createdLanguageIds.push(language.id);

    await deleteLanguage(language.id);

    const languages = await listLanguages();
    expect(languages.find((l) => l.id === language.id)).toBeUndefined();
  });

  it("refuses to delete a language that books still reference", async () => {
    const language = await createLanguage({ code: "ti", name: "Test In Use", rtl: false });
    createdLanguageIds.push(language.id);

    const book = await prisma.book.create({
      data: {
        slug: "test-in-use-book",
        title: "Test In Use Book",
        author: "Test Author",
        shelfNumber: "A1",
        languageId: language.id,
      },
    });
    createdBookIds.push(book.id);

    await expect(deleteLanguage(language.id)).rejects.toBeInstanceOf(InUseError);

    const languages = await listLanguages();
    expect(languages.find((l) => l.id === language.id)).toBeDefined();
  });
});
