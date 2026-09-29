import { test, expect } from '@playwright/test';

test.describe('SnailPay Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should successfully charge with test card', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');

    await page.fill('input[name="cardNumber"]', '1234123412341234');
    await page.fill('input[name="expiry"]', '12/26');
    await page.fill('input[name="cvv"]', '543');
    await page.fill('input[name="fullName"]', 'TEST USER');
    await page.fill('input[name="amount"]', '100');

    await page.click('button[type="submit"]:has-text("Pagar")');

    await expect(page.locator('text=Recarga de $100.00 aprobada')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Saldo actual')).toBeVisible();
    await expect(page.locator('text=$100.00')).toBeVisible();
  });

  test('should reject invalid card number', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');

    await page.fill('input[name="cardNumber"]', '1111111111111111');
    await page.fill('input[name="expiry"]', '12/26');
    await page.fill('input[name="cvv"]', '543');
    await page.fill('input[name="fullName"]', 'TEST USER');
    await page.fill('input[name="amount"]', '50');

    await page.click('button[type="submit"]:has-text("Pagar")');

    await expect(page.locator('text=Número de tarjeta inválido')).toBeVisible({ timeout: 10000 });
  });

  test('should reject expired card', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');

    await page.fill('input[name="cardNumber"]', '1234123412341234');
    await page.fill('input[name="expiry"]', '01/20');
    await page.fill('input[name="cvv"]', '543');
    await page.fill('input[name="fullName"]', 'TEST USER');
    await page.fill('input[name="amount"]', '50');

    await page.click('button[type="submit"]:has-text("Pagar")');

    await expect(page.locator('text=Tarjeta expirada')).toBeVisible({ timeout: 10000 });
  });

  test('should reject wrong CVV', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');

    await page.fill('input[name="cardNumber"]', '1234123412341234');
    await page.fill('input[name="expiry"]', '12/26');
    await page.fill('input[name="cvv"]', '123');
    await page.fill('input[name="fullName"]', 'TEST USER');
    await page.fill('input[name="amount"]', '50');

    await page.click('button[type="submit"]:has-text("Pagar")');

    await expect(page.locator('text=CVV inválido')).toBeVisible({ timeout: 10000 });
  });

  test('should show test card hint', async ({ page }) => {
    await page.click('button:has-text("Recargar saldo con SnailPay")');

    await expect(page.locator('text=Tarjeta de prueba (éxito):')).toBeVisible();
    await expect(page.locator('text=1234 1234 1234 1234')).toBeVisible();
    await expect(page.locator('text=12/26')).toBeVisible();
    await expect(page.locator('text=543')).toBeVisible();
  });
});