import admin from 'firebase-admin';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'
import { serviceAccount, test } from './auth.setup';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Get a Firestore reference
const db = admin.firestore();

// Example function to batch delete documents
async function batchDeleteDocuments() {
  try {
    // Query documents to delete (e.g., where "toDelete" field is true)
    const querySnapshot = await db.collection('nominees')
                                .where('name', '==', 'Andrew')
                                .get();

    // Create a batch object
    const batch = db.batch();

    // Add delete operations to the batch
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();

    console.log('Batch delete successful.');
  } catch (error) {
    console.error('Error batch deleting documents:', error);
  }
}

test.describe('Admin', () => {
  test.afterEach(async () => {
    // clear test nominees
    await batchDeleteDocuments()
  });

  test('new nominee' , async ({ auth, page }) => {
    await page.goto('/nominate')
    
    await page.getByPlaceholder('Your Name').fill('Andrew');
    await page.getByPlaceholder('thom.yorke@yahoo.com').fill('good.email@gmail.com');
    await page.getByPlaceholder('https://www.youre-legit.com').fill('https://www.google.com');
    await page.getByLabel('Genre(s)').click();
    await page.getByRole('option', { name: 'Photography' }).click();
    await page.getByRole('dialog').nth(1).press('Escape');
    await page.getByLabel('Location').click();
    await page.getByPlaceholder('Search...').fill('sa');
    await page.getByRole('option', { name: 'San Francisco CA, USA' }).click();
    await expect(page.getByText('San Francisco, CA, USA')).toBeVisible()
    await page.getByRole('button', { name: 'Submit' }).click();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    await expect(page.getByText('Your nomination has been successfully submitted!', { exact: true })).toBeVisible();

    await page.goto('/admin');
    await auth.login(page);
    await page.getByText("Admin View").waitFor();

    await expect(page.locator('tbody')).toContainText('Andrew');
  });

//   test('new row added to gsheet', async () => {
//         // google sheets
//         const doc = new GoogleSpreadsheet(process.env.OPF_ARTISTS_GSHEET_ID as string, jwt);
//         await doc.loadInfo(); // loads document properties and worksheets
//         const sheet = doc.sheetsById['645746189'];
//         const rows = await sheet.getRows<NomineeRowData>(); // return the rows from the 1st sheet
//         const lastAddedRow = extractNominee(rows[rows.length - 1]);

//         function extractNominee(row: GoogleSpreadsheetRow) {
//             return {
//                 name: row.get("Name"),
//                 email: row.get("Email"),
//                 website: row.get("Website"),
//                 genre: row.get("Genre"),
//             }
//         }

//         expect(lastAddedRow).toEqual(testNominee)
//   })

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });
  
//   test('has title', async ({ page }) => {
//     await expect(page).toHaveTitle(/OPF/);
//   });

//   test('should not have any automatically detectable accessibility issues', async ({ page }) => {
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
//     expect(accessibilityScanResults.violations).toEqual([]);
//   });
});