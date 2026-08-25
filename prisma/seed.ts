import "dotenv/config";

import bcrypt from "bcryptjs";

import { prisma } from "../lib/db";
import { localeMeta } from "../lib/locales";

async function main() {
  // The five UI locales are also the initial set of book languages -
  // admins can add more later via the Language CRUD screen (M2).
  for (const [code, meta] of Object.entries(localeMeta)) {
    await prisma.language.upsert({
      where: { code },
      update: { name: meta.englishName, rtl: meta.rtl },
      create: { code, name: meta.englishName, rtl: meta.rtl },
    });
  }

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "kitaabi-dev-only";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`Seeded ${Object.keys(localeMeta).length} languages and admin "${username}".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
