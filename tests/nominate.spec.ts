import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

type NomineeRowData = {
    'name': string;
    'email': string;
    'website': string;
    'genre': string;
  }

const testNominee: NomineeRowData = {
    "name": "Andrew",
    "email": "good.email@gmail.com",
    "website": "https://www.google.com",
    "genre": "Photography",
}
  
  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ];
  
  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
    scopes: SCOPES,
  });
  
test.describe('Nominate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'NOMINATE' }).click();
    await page.waitForURL('**/nominate')
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

  // cover success case in admin.spec.ts
});
