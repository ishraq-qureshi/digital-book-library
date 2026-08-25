import { expect, test } from "@playwright/test";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "kitaabi-dev-only";

test("redirects an unauthenticated visitor from admin to the login page", async ({ page }) => {
  await page.goto("/en/admin");
  await expect(page).toHaveURL(/\/en\/admin\/login$/);
});

test("shows an error for an incorrect password", async ({ page }) => {
  await page.goto("/en/admin/login");
  await page.getByLabel("Username").fill(ADMIN_USERNAME);
  await page.getByLabel("Password").fill("definitely-wrong");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Incorrect username or password.")).toBeVisible();
  await expect(page).toHaveURL(/\/en\/admin\/login$/);
});

test("signs in and back out", async ({ page }) => {
  await page.goto("/en/admin/login");
  await page.getByLabel("Username").fill(ADMIN_USERNAME);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/en\/admin$/);
  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/en$/);

  await page.goto("/en/admin");
  await expect(page).toHaveURL(/\/en\/admin\/login$/);
});
