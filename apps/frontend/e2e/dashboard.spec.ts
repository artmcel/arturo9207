import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display user info and balance', async ({ page }) => {
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=Saldo actual')).toBeVisible();
    await expect(page.locator('text=$0.00')).toBeVisible();
  });

  test('should display charts', async ({ page }) => {
    await expect(page.locator('text=Apuestas')).toBeVisible();
    await expect(page.locator('text=Victorias por Caracol')).toBeVisible();
  });

  test('should open SnailPay modal', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');
    await expect(page.locator('text=Recargar saldo con SnailPay')).toBeVisible();
    await expect(page.locator('input[name="cardNumber"]')).toBeVisible();
    await expect(page.locator('input[name="expiry"]')).toBeVisible();
    await expect(page.locator('input[name="cvv"]')).toBeVisible();
  });

  test('should close SnailPay modal', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');
    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('text=Recargar saldo con SnailPay')).not.toBeVisible();
  });
});