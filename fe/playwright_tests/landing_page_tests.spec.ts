/*
Tyler Khin
CSC289 - Group 9
Creation Date: September 19th, 2025
Latest Revision: December 8th, 2025
landing_page_tests.spec.ts: UI tests for the landing page and navigation
*/

import { test, expect } from '@playwright/test';

// Test page loads
test('test title', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite/);
});

// Test link navigation
test('test header navigation', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');
  // Test game link
  await page.getByRole('link', { name: 'Game' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:5173/game');

  // Test account link
  await page.getByRole('link', { name: 'Account' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:5173/account');

  // Test landing page
  await page.getByRole('link', { name: 'SpinStorm' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:5173');
});