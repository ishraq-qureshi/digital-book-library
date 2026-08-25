import { prisma } from "@/lib/db";
import { DuplicateNameError, InUseError, isPrismaUniqueConstraintError } from "@/lib/errors";

export async function listLanguages() {
  const languages = await prisma.language.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return languages.map((l) => ({
    id: l.id,
    code: l.code,
    name: l.name,
    rtl: l.rtl,
    bookCount: l._count.books,
  }));
}

export async function createLanguage(input: { code: string; name: string; rtl: boolean }) {
  try {
    return await prisma.language.create({ data: input });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) throw new DuplicateNameError(input.code);
    throw error;
  }
}

export function renameLanguage(id: string, input: { name: string; rtl: boolean }) {
  return prisma.language.update({ where: { id }, data: input });
}

export async function deleteLanguage(id: string) {
  // A book's language is required, not a removable tag - unlike category/
  // subject, deleting a language in use would orphan books. Check first so
  // the caller gets a clear count instead of a raw FK constraint error.
  const bookCount = await prisma.book.count({ where: { languageId: id } });
  if (bookCount > 0) throw new InUseError(bookCount);

  return prisma.language.delete({ where: { id } });
}
