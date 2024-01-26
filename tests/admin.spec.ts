import { expect } from '@playwright/test'
import { test } from './auth.setup' // <----- here we import test from our auth.setup.ts.
import { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright';

const TEST_NOMINEE: {} = {}

test.describe.only('admin view', () => {
  test.afterAll(() => {
    // TODO: cleanup: remove TEST_NOMINEE from 'artists' and 'nominees' collections
  });

  test('has title', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveTitle(/OPF | Admin/);
  });

//   test('not logged in - should not have any automatically detectable accessibility issues', async ({ page, auth }: { page: Page; auth: any }) => {
//     await page.goto('/admin', { waitUntil: 'networkidle' })    
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
//     expect(accessibilityScanResults.violations).toEqual([]);
//   });

//   test('logged in - should not have any automatically detectable accessibility issues', async ({ page, auth }: { page: Page; auth: any }) => {
//     await page.goto('/admin', { waitUntil: 'networkidle' })
//     await auth.login(page)
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
//     expect(accessibilityScanResults.violations).toEqual([]);
//   });

  test('', async ({ page, auth }: { page: Page; auth: any }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' })
    await auth.login(page)
    await expect(page.getByText('Admin View')).toBeVisible()
  });

  test('adding new nominee populates new row in Admin View', async ({ page, auth }: { page: Page; auth: any }) => {
    // page.goto("/nominate")
    // populate fields with TEST_NOMINEE data
    // click submit
    // await success feedback

    // page.goto("/admin")
    // await expect row to be visible matching TEST_NOMINEE data
  });

  test('approving nominee populates new artist in Home page', async ({ page, auth }: { page: Page; auth: any }) => {
    // page.goto("/admin")
    // expect nominee status to be "Pending"
    // change status to "Approved"
    // await expect nominee row's "Status" to change to "Approved"
    // page.goto("/")
    // await expect TEST_NOMINEE.name to be on the page
  });

  test('approved artist has a website preview image', async ({ page, auth }: { page: Page; auth: any }) => {});

  test('rejecting existing artist removes artist from Home page', ({ page }) => {
    // page.goto("/")
    // await expect TEST_NOMINEE.name to be on the page
    // page.goto("/admin")
    // expect nominee status to be "Approved"
    // change status to "Rejected"
    // await expect nominee row's "Status" to change to "Rejected"
    // page.goto("/")
    // await expect TEST_NOMINEE.name NOT to be on the page
  });

  test('pending existing artist removes artist from Home page', async ({ page, auth }: { page: Page; auth: any }) => {
    // page.goto("/")
    // await expect TEST_NOMINEE.name to be on the page
    // page.goto("/admin")
    // expect nominee status to be "Approved"
    // change status to "Pending"
    // await expect nominee row's "Status" to change to "Pending"
    // page.goto("/")
    // await expect TEST_NOMINEE.name NOT to be on the page
  });
})
