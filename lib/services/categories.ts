import { prisma } from "@/lib/db";
import { DuplicateNameError, isPrismaUniqueConstraintError } from "@/lib/errors";

export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    bookCount: c._count.books,
  }));
}

export async function createCategory(name: string) {
  try {
    return await prisma.category.create({ data: { name } });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) throw new DuplicateNameError(name);
    throw error;
  }
}

export async function renameCategory(id: string, name: string) {
  try {
    return await prisma.category.update({ where: { id }, data: { name } });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) throw new DuplicateNameError(name);
    throw error;
  }
}

export function deleteCategory(id: string) {
  // Deleting a category only removes the tag from books (BookCategory
  // cascades) - it never deletes the books themselves.
  return prisma.category.delete({ where: { id } });
}
