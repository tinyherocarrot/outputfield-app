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
    "genre": "Genre 1",
}
  
  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ];
  
  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
  });
  
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

  test('new row added to gsheet', async () => {
        // google sheets
        const doc = new GoogleSpreadsheet(process.env.OPF_ARTISTS_GSHEET_ID as string, jwt);
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsById['645746189'];
        const rows = await sheet.getRows<NomineeRowData>(); // return the rows from the 1st sheet
        const lastAddedRow = extractNominee(rows[rows.length - 1]);

        function extractNominee(row: GoogleSpreadsheetRow) {
            return {
                name: row.get("Name"),
                email: row.get("Email"),
                website: row.get("Website"),
                genre: row.get("Genre"),
            }
        }

        expect(lastAddedRow).toEqual(testNominee)
  })
});
