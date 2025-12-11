/*
Tyler Khin
CSC289 - Group 9
Creation Date: September 19th, 2025
Latest Revision: December 8th, 2025
auth_tests.spec.ts: UI tests for logging in and out (registering should be done manually)
*/

import { test, expect } from '@playwright/test';

// Use empty storageState for file
test.use({ storageState: { cookies: [], origins: [] } });

// Test sign in
test('test sign in', async ({ page }) => {
  // Navigate to landing page
  await page.goto('http://127.0.0.1:5173/');

  // Go to login page
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.waitForURL('http://127.0.0.1:5173/login');
  
  // Fill in login form
  await expect(page.getByPlaceholder('email')).toBeEditable();
  await page.getByPlaceholder('email').fill('tester@email.com');
  await expect(page.getByPlaceholder('email')).toHaveValue('tester@email.com');

  await expect(page.getByPlaceholder('password')).toBeEditable();
    await page.getByPlaceholder('password').fill('Aw3s0m3P@ss!');
  await expect(page.getByPlaceholder('password')).toHaveValue('Aw3s0m3P@ss!');

  // Submit form and redirect
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('http://127.0.0.1:5173/game');

  // Check if sign out button is visible and logout
  await page.goto('http://127.0.0.1:5173/');
  await page.getByRole('button', { name: 'Sign out' }).click();

  // Check if sign in and register buttons are visible
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});