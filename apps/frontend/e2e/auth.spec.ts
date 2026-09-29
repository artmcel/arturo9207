import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login');
  });

  test('should register a new user', async ({ page }) => {
    await page.click('text=Regístrate');
    await expect(page).toHaveURL('/register');

    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should login with existing credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Correo electrónico inválido')).toBeVisible();
    await expect(page.locator('text=La contraseña es requerida')).toBeVisible();
  });

  test('should logout', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.click('button:has-text("Cerrar sesión")');
    await expect(page).toHaveURL('/login');
  });
});