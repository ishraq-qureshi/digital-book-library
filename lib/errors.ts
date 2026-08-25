export class DuplicateNameError extends Error {
  constructor(name: string) {
    super(`"${name}" already exists.`);
  }
}

export class InUseError extends Error {
  constructor(public readonly bookCount: number) {
    super(`In use by ${bookCount} book(s).`);
  }
}

export function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
