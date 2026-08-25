"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";

type Copy = {
  usernameLabel: string;
  passwordLabel: string;
  submit: string;
  error: string;
  rateLimited: string;
};

export function LoginForm({ copy }: { copy: Copy }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    setSubmitting(false);

    if (!result || result.error) {
      setError(result?.code === "rate_limited" ? copy.rateLimited : copy.error);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">{copy.usernameLabel}</Label>
        <Input id="username" name="username" autoComplete="username" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{copy.passwordLabel}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting}>
        {copy.submit}
      </Button>
    </form>
  );
}
