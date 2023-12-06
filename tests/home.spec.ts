import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'

test.describe('Main', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/OPF/);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
