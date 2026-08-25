import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows attempts up to the limit, then blocks", () => {
    const key = "1.2.3.4:test-allows";
    const opts = { limit: 3, windowMs: 60_000 };

    expect(checkRateLimit(key, opts).allowed).toBe(true);
    expect(checkRateLimit(key, opts).allowed).toBe(true);
    expect(checkRateLimit(key, opts).allowed).toBe(true);

    const fourth = checkRateLimit(key, opts);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("resets once the window elapses", () => {
    const key = "1.2.3.4:test-resets";
    const opts = { limit: 1, windowMs: 60_000 };

    expect(checkRateLimit(key, opts).allowed).toBe(true);
    expect(checkRateLimit(key, opts).allowed).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(checkRateLimit(key, opts).allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("key-a", opts).allowed).toBe(true);
    expect(checkRateLimit("key-b", opts).allowed).toBe(true);
    expect(checkRateLimit("key-a", opts).allowed).toBe(false);
  });
});
