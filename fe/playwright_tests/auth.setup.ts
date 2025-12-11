/*
Tyler Khin
CSC289 - Group 9
Creation Date: September 19th, 2025
Latest Revision: December 10th, 2025
auth.setup.ts: Setup for testing account
*/

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Send authentication request. Account is manually created
  await page.goto('http://127.0.0.1:5173/login');
  await page.getByPlaceholder('email').fill('tester@email.com');
  await page.getByPlaceholder('password').fill('Aw3s0m3P@ss!');
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('http://127.0.0.1:5173/game');
  
  // Get the current number of free spins
  await expect(page.getByText(/Free Spins Remaining:/)).toBeVisible();
  let old_spins = await page.getByText(/Free Spins Remaining:/).innerText();

  // Spin until there are 5 free spins
  old_spins = old_spins.replace('Free Spins Remaining: ', '');
  while (parseInt(old_spins) < 5) {
    await page.getByRole('button', { name: '– Bet' }).click();
    await page.getByRole('button', { name: 'Spin button' }).click();
    old_spins = await page.getByText(/Free Spins Remaining:/).innerText();
    old_spins = old_spins.replace('Free Spins Remaining: ', '');
  }

  await page.context().storageState({ path: authFile });
});