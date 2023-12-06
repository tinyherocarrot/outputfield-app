import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'

test.describe('Suggest', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'SUGGEST' }).click();
    await page.waitForURL('**/suggest')
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('feedback on empty fields', async ({ page }) => {
    // Try submitting empty form
    const submitButton = page.getByText('Submit')
    await submitButton.click()

    // Expect Errors
    expect(page.getByText('Username must be at least 2 characters.')).toBeVisible
    expect(page.getByText('Invalid email')).toBeVisible
    expect(page.getByText('Invalid URL')).toBeVisible
    expect(page.getByText('Select at least 1 genre.')).toBeVisible
    expect(page.getByText('Required')).toBeVisible
  });

  test('feedback on invalid fields', async ({ page }) => {
    await page.getByPlaceholder('Your Name').fill('A');
    await page.getByPlaceholder('thom.yorke@yahoo.com').fill('bad.email@');
    await page.getByPlaceholder('https://www.youre-legit.com').fill('www.google.com');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Expect Errors
    expect(page.getByText('Username must be at least 2 characters.')).toBeVisible
    expect(page.getByText('Invalid email')).toBeVisible
    expect(page.getByText('Invalid URL')).toBeVisible
    expect(page.getByText('Select at least 1 genre.')).toBeVisible
    expect(page.getByText('Required')).toBeVisible
  });

  test('feedback on valid fields', async ({ page }) => {
    await page.getByPlaceholder('Your Name').fill('Andrew');
    await page.getByPlaceholder('thom.yorke@yahoo.com').fill('good.email@gmail.com');
    await page.getByPlaceholder('https://www.youre-legit.com').fill('https://www.google.com');
    await page.getByLabel('Genre(s)').click();
    await page.getByRole('option', { name: 'Genre 1' }).click();
    await page.getByRole('dialog').nth(1).press('Escape');
    await page.getByLabel('Location').click();
    await page.getByPlaceholder('Search...').fill('sa');
    await page.getByRole('option', { name: 'San Francisco CA, USA' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    expect(page.getByText("Your nomination has been successfully submitted!")).toBeVisible;

  });
});
