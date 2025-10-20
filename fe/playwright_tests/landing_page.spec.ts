import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite/);
});

test('header navigation', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // Test game link
  await page.getByRole('link', { name: 'Game' }).click();
  await expect(page.locator("div").getByText("Slot machine mockup")).toBeVisible();

  // Test account link
  await page.getByRole('link', { name: 'Account' }).click();
  await expect(page.locator("div").getByText("Account Overview")).toBeVisible();

  // Test landing page
  await page.getByRole('link', { name: 'SpinStorm' }).click();
  await expect(page.getByRole('heading', { name: 'Spin. Win. Shine.' })).toBeVisible();
});