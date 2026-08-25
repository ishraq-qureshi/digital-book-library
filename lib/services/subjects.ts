import { prisma } from "@/lib/db";
import { DuplicateNameError, isPrismaUniqueConstraintError } from "@/lib/errors";

export async function listSubjects() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return subjects.map((s) => ({
    id: s.id,
    name: s.name,
    bookCount: s._count.books,
  }));
}

export async function createSubject(name: string) {
  try {
    return await prisma.subject.create({ data: { name } });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) throw new DuplicateNameError(name);
    throw error;
  }
}

export async function renameSubject(id: string, name: string) {
  try {
    return await prisma.subject.update({ where: { id }, data: { name } });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) throw new DuplicateNameError(name);
    throw error;
  }
}

export function deleteSubject(id: string) {
  // Deleting a subject only removes the tag from books (BookSubject
  // cascades) - it never deletes the books themselves.
  return prisma.subject.delete({ where: { id } });
}
