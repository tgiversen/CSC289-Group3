/*
Tyler Khin
CSC289 - Group 9
Creation Date: September 19th, 2025
Latest Revision: December 11th, 2025
game_tests.spec.ts: UI tests for the game page and its functions
*/

import { test, expect } from '@playwright/test';

// Test if spin works
test('test spin', async ({ page }) => {
  // Go to game page
  await page.goto('http://127.0.0.1:5173/game');
  
  // Get account balance
  const account_balance = page.locator('.amt');

  // Wait for account to load (page loads before account)
  await expect(account_balance).not.toHaveText('0');

  // Get current balance
  const old_amount = await account_balance.innerText();

  // Get spin tracker
  const spin_tracker = page.getByText('🎰 No spins yet — try your luck!');

  // Press spin button
  await expect(page.getByRole('button', { name: 'Spin button' })).toBeVisible();
  await page.getByRole('button', { name: 'Spin button' }).click();

  // Check for message
  await expect(page.getByText(/!/)).toContainClass('message');

  // Check if balance updates accordingly
  await expect(account_balance).not.toHaveText(old_amount);

  // Check if spin counter updates
  await expect(spin_tracker).not.toBeVisible();
});

// Test if free spin works
test('test free spin', async ({ page }) => {
  // Go to game page
  await page.goto('http://127.0.0.1:5173/game');

  // Wait for account to load (page loads before account)
  await expect(page.locator('.amt')).not.toHaveText('0');

  // Get free spin counter
  const spin_tracker = page.getByText('🎰 No spins yet — try your luck!');

  // Press free spin button
  await expect(page.getByRole('button', { name: '🕹️ Use Free Spin' })).toBeVisible();
  await page.getByRole('button', { name: '🕹️ Use Free Spin' }).click();

  // Check if spin counter updates
  await expect(spin_tracker).not.toBeVisible();
});

// Test if bet works
test('test bet', async ({ page }) => {
  // go to game page
  await page.goto('http://127.0.0.1:5173/game');

  // Wait for account to load (page loads before account)
  await expect(page.locator('.amt')).not.toHaveText('0');

  // Get bet amount
  const bet = page.getByTestId('bet-amount');

  // Get current bet
  await expect(bet).toBeVisible();
  const old_amount = await bet.innerText();

  // lower bet
  await expect(page.getByRole('button', { name: '– Bet' })).toBeVisible();
  await page.getByRole('button', { name: '– Bet' }).click();

  // Check if bet updates accordingly
  await expect(bet).not.toHaveText(old_amount);

  // lower bet
  await expect(page.getByRole('button', { name: '+ Bet' })).toBeVisible();
  await page.getByRole('button', { name: '+ Bet' }).click();

  // Check if bet resets
  await expect(bet).toHaveText(old_amount);
});

// Test if daily reward button functions (does not check whether the reward is given)
test('test daily reward button', async ({ page }) => {
  // Go to game page
  await page.goto('http://127.0.0.1:5173/game');

  // Accept dialog when reward button is clicked
  page.on('dialog', dialog => dialog.accept());

  // Wait for account to load (page loads before account)
  await expect(page.locator('.amt')).not.toHaveText('0');

  // Press daily reward button
  await page.getByRole('button', { name: /Daily Reward/ }).click();
});