import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- referenced only so TS resolves the module for the `declare module "next-auth/jwt"` augmentation below
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  // Vercel sets this automatically in production; Docker Compose/local
  // `next start` don't run behind a host Auth.js already trusts, so it
  // must be told explicitly (safe here: this app is never reverse-proxied
  // through an untrusted host).
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw, request) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        if (!checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT).allowed) {
          throw new RateLimitedError();
        }

        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const admin = await prisma.admin.findUnique({
          where: { username: parsed.data.username },
        });
        if (!admin) return null;

        const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, name: admin.username };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.adminId = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.adminId) session.user.id = token.adminId as string;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    adminId?: string;
  }
}
