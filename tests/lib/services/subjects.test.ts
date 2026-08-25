import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { DuplicateNameError } from "@/lib/errors";
import {
  createSubject,
  deleteSubject,
  listSubjects,
  renameSubject,
} from "@/lib/services/subjects";

const createdIds: string[] = [];

afterEach(async () => {
  await prisma.subject.deleteMany({ where: { id: { in: createdIds } } });
  createdIds.length = 0;
});

describe("subject taxonomy service", () => {
  it("creates a subject and lists it with a zero book count", async () => {
    const subject = await createSubject("Test History");
    createdIds.push(subject.id);

    const subjects = await listSubjects();
    const found = subjects.find((s) => s.id === subject.id);

    expect(found?.name).toBe("Test History");
    expect(found?.bookCount).toBe(0);
  });

  it("rejects creating a duplicate name", async () => {
    const subject = await createSubject("Test Poetry");
    createdIds.push(subject.id);

    await expect(createSubject("Test Poetry")).rejects.toBeInstanceOf(DuplicateNameError);
  });

  it("renames a subject", async () => {
    const subject = await createSubject("Test Old Subject");
    createdIds.push(subject.id);

    const renamed = await renameSubject(subject.id, "Test New Subject");
    expect(renamed.name).toBe("Test New Subject");
  });

  it("deletes a subject", async () => {
    const subject = await createSubject("Test Delete Subject");
    createdIds.push(subject.id);

    await deleteSubject(subject.id);

    const subjects = await listSubjects();
    expect(subjects.find((s) => s.id === subject.id)).toBeUndefined();
  });
});
