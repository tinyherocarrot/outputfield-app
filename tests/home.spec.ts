import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'

test.describe('Main', () => {
  test.beforeAll(() => {
    // run seed
  });

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

  // TODO:
  test.skip('sort by date', async ({ page }) => {

    
  });
  test.skip('sort by alphabetical', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByLabel('A - Z').click();
  });
  test.skip('sort by location', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByLabel('Near Me').click();
  });
  test.skip('sort by genre', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByLabel('Genre').click();
  });
});
