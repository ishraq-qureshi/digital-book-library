import { expect, test } from "@playwright/test";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "kitaabi-dev-only";

test.beforeEach(async ({ page }) => {
  await page.goto("/en/admin/login");
  await page.getByLabel("Username").fill(ADMIN_USERNAME);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/en\/admin$/);
});

test("adds, renames, and deletes a category", async ({ page }) => {
  await page.goto("/en/admin/categories");

  const name = `E2E Category ${Date.now()}`;
  await page.getByPlaceholder("New category name").fill(name);
  await page.getByRole("button", { name: "Add" }).click();

  const row = page.getByRole("listitem").filter({ hasText: name });
  await expect(row).toBeVisible();
  await expect(row).toContainText("Books: 0");

  const renamed = `${name} Renamed`;
  await row.getByRole("button", { name: "Rename" }).click();
  await page.getByRole("listitem").getByRole("textbox").fill(renamed);
  await page.getByRole("button", { name: "Save" }).click();

  const renamedRow = page.getByRole("listitem").filter({ hasText: renamed });
  await expect(renamedRow).toBeVisible();

  await renamedRow.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();

  await expect(page.getByRole("listitem").filter({ hasText: renamed })).toHaveCount(0);
});
