// TODO: mock authentication 
// (see https://www.npmjs.com/package/@nearform/playwright-firebase)

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TEST_NOMINEE: {} = {}

test.describe('admin view', () => {
  test.afterAll(() => {
    // TODO: cleanup: remove TEST_NOMINEE from 'artists' and 'nominees' collections
  });

  test('has title', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveTitle(/OPF | Admin/);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/admin')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('adding new nominee populates new row in Admin View', ({ page }) => {
    // page.goto("/nominate")
    // populate fields with TEST_NOMINEE data
    // click submit
    // await success feedback

    // page.goto("/admin")
    // await expect row to be visible matching TEST_NOMINEE data
  });

  test('approving nominee populates new artist in Home page', ({ page }) => {
    // page.goto("/admin")
    // expect nominee status to be "Pending"
    // change status to "Approved"
    // await expect nominee row's "Status" to change to "Approved"
    // page.goto("/")
    // await expect TEST_NOMINEE.name to be on the page
  });

  test('approved artist has a website preview image', ({ page }) => {});

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

  test('pending existing artist removes artist from Home page', ({ page }) => {
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
