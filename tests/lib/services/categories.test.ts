import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { DuplicateNameError } from "@/lib/errors";
import {
  createCategory,
  deleteCategory,
  listCategories,
  renameCategory,
} from "@/lib/services/categories";

const createdIds: string[] = [];

afterEach(async () => {
  await prisma.category.deleteMany({ where: { id: { in: createdIds } } });
  createdIds.length = 0;
});

describe("category taxonomy service", () => {
  it("creates a category and lists it with a zero book count", async () => {
    const category = await createCategory("Test Fiction");
    createdIds.push(category.id);

    const categories = await listCategories();
    const found = categories.find((c) => c.id === category.id);

    expect(found).toBeDefined();
    expect(found?.name).toBe("Test Fiction");
    expect(found?.bookCount).toBe(0);
  });

  it("rejects creating a duplicate name", async () => {
    const category = await createCategory("Test Duplicate");
    createdIds.push(category.id);

    await expect(createCategory("Test Duplicate")).rejects.toBeInstanceOf(DuplicateNameError);
  });

  it("renames a category", async () => {
    const category = await createCategory("Test Old Name");
    createdIds.push(category.id);

    const renamed = await renameCategory(category.id, "Test New Name");
    expect(renamed.name).toBe("Test New Name");
  });

  it("deletes a category", async () => {
    const category = await createCategory("Test To Delete");
    createdIds.push(category.id);

    await deleteCategory(category.id);

    const categories = await listCategories();
    expect(categories.find((c) => c.id === category.id)).toBeUndefined();
  });
});
