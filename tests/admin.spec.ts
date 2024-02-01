// TODO: outputfield/outputfield-app#48
import { expect } from '@playwright/test'
import { test } from './auth.setup' // <----- here we import test from our auth.setup.ts.
import { Page } from '@playwright/test'
import { artistsColl, nomineeColl } from '@/lib/firebase/composables/useDb';
import { query, where, getDocs, deleteDoc } from '@firebase/firestore';

const TEST_NOMINEE = {
  name: 'Testie Test',
  email: 'good.email@gmail.com',
  website_url: 'https://www.google.com',
  genre: ['Photography'],
  date_created: new Date(),
  location: 'San Francisco CA, USA'
}

const deleteNomineesByName = async(nameToDelete: string) => {
  try {
    // Create a query to find documents with the specified name
    const q = query(nomineeColl, where("name", "==", nameToDelete));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // Loop through the documents and delete each one
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Document with ID ${doc.id} deleted successfully.`);
    });
  } catch (error) {
    console.error("Error deleting documents: ", error);
  }
}

const deleteArtistsByName = async(nameToDelete: string) => {
  try {
    // Create a query to find documents with the specified name
    const q = query(artistsColl, where("name", "==", nameToDelete));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // Loop through the documents and delete each one
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Document with ID ${doc.id} deleted successfully.`);
    });
  } catch (error) {
    console.error("Error deleting documents: ", error);
  }
}

test.describe.fixme('admin view', () => {
  test.afterAll(async () => {
    await deleteNomineesByName(TEST_NOMINEE.name)
    await deleteArtistsByName(TEST_NOMINEE.name)
  });

  test('has title', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveTitle(/OPF | Admin/);
  });

  test('logged out, shows login button', async ({ page, auth }: { page: Page; auth: any }) => {
    test.slow();
    await page.goto('/admin')
    await expect(page.getByText('Sign In with Google')).toBeVisible()
  });

  test('logged in, shows header text', async ({ page, auth }: { page: Page; auth: any }) => {
    test.slow()
    await page.goto('/admin')
    await auth.login(page)
    await expect(page.getByText('Admin View')).toBeVisible()
    await auth.logout(page)
  });

  test.describe.serial('approving a nominee', () => {
    test.afterAll(async () => {
      await deleteNomineesByName(TEST_NOMINEE.name)
      await deleteArtistsByName(TEST_NOMINEE.name)
    });

    test('creates new artist on Landing page', async ({ page , auth }) => {
      await test.step('nominate', async () => {
          await page.goto("/nominate")
          await page.getByLabel('Name').fill(TEST_NOMINEE.name);
          await page.getByLabel('Email Address').fill(TEST_NOMINEE.email);
          await page.getByLabel('Website').fill(TEST_NOMINEE.website_url);
          await page.getByLabel('Genre(s)').click();
          await page.getByRole('option', { name: TEST_NOMINEE.genre[0] }).click();
          await page.getByRole('dialog').nth(1).press('Escape');
          await page.getByLabel('Location').click();
          await page.getByPlaceholder('Search...').fill('sa');
          await page.getByRole('option', { name: TEST_NOMINEE.location }).click();
          await expect(page.getByText('San Francisco, CA, USA')).toBeVisible();
          // click submit
          await page.getByRole('button', { name: 'Submit' }).click();
      
          // await success feedback
          expect(page.getByText("Your nomination has been successfully submitted!")).toBeVisible;
        });
        
        // new row in Admin View
        await page.goto("/admin");
        await auth.login(page);
  
        // await expect row to be visible matching TEST_NOMINEE data
        await expect(page.getByText(TEST_NOMINEE.name)).toBeVisible()

        await test.step('approve nominee', async () => {
          await expect(
            page.getByRole('row', { name: `${TEST_NOMINEE.name} ${TEST_NOMINEE.email}` }).getByRole('cell', { name: 'Pending' }).first()
          ).toBeVisible();
      
          // change status to "Approved"
          await page.getByRole('row', { name: `${TEST_NOMINEE.name} ${TEST_NOMINEE.email}` }).getByRole('button').click();
          await page.getByText('Change Status').waitFor({ state: "attached" });  // <- wait for element
          await page.getByRole('menuitem', { name: 'Change Status' }).click();
          await page.getByRole('menuitem', { name: 'Approved' }).click();
          await page.getByRole('button', { name: 'Continue' }).waitFor({ state: "attached" });  // <- wait for element
          await page.getByRole('button', { name: 'Continue' }).click();
      
          // await expect nominee row's "Status" to change to "Approved"
          await expect(
            page.getByRole('row', { name: `${TEST_NOMINEE.name} ${TEST_NOMINEE.email}` }).getByRole('cell', { name: 'Approved' }).first()
          ).toBeVisible();
      
        })

        // new artist on Landing
        await page.goto("/");
        await expect(page.getByText(TEST_NOMINEE.name)).toBeVisible();

        // TODO: new artist has preview image
      })
  })

  // test.describe('new nominee ', () => {
  //   test.afterEach(async () => {
  //     await deleteNomineesByName(TEST_NOMINEE.name)
  //     await deleteArtistsByName(TEST_NOMINEE.name)
  //   });
    
  //   test('populates new row in Admin View', async ({ page, auth }: { page: Page; auth: any }) => {
  //     test.step('create nominee', async () => {
  //       page.goto("/nominate")
  //       await page.getByLabel('Name').fill(TEST_NOMINEE.name);
  //       await page.getByLabel('Email Address').fill(TEST_NOMINEE.email);
  //       await page.getByLabel('Website').fill(TEST_NOMINEE.website_url);
  //       await page.getByLabel('Genre(s)').click();
  //       await page.getByRole('option', { name: TEST_NOMINEE.genre[0] }).click();
  //       await page.getByRole('dialog').nth(1).press('Escape');
  //       await page.getByLabel('Location').click();
  //       await page.getByPlaceholder('Search...').fill('sa');
  //       await page.getByRole('option', { name: TEST_NOMINEE.location }).click();
  //       await expect(page.getByText('San Francisco, CA, USA')).toBeVisible();
  //       // click submit
  //       await page.getByRole('button', { name: 'Submit' }).click();
    
  //       // await success feedback
  //       expect(page.getByText("Your nomination has been successfully submitted!")).toBeVisible;
  //     })


  //     await page.goto("/admin");
  //     await auth.login(page);
  
  //     // await expect row to be visible matching TEST_NOMINEE data
  //     await expect(page.getByText(TEST_NOMINEE.name)).toBeVisible()
  //   });

  //   // test('changing nominee status as an unauthorized user gives 400 error', async ({ page, auth }: { page: Page; auth: any }) => {})

  //   test('approving nominee creates new Artist"', async ({ page, auth }: { page: Page; auth: any }) => {
  //     await page.goto("/admin");
  //     await auth.login(page);
  
  //     // expect nominee status to be "Pending"
  //     await expect(
  //       page.getByRole('row', { name: `${TEST_NOMINEE.name} ${TEST_NOMINEE.email}` }).getByRole('cell', { name: 'Pending' }).first()
  //     ).toBeVisible();
  
  //     // change status to "Approved"
  //     await page.getByRole('row', { name: `${TEST_NOMINEE.name} ${TEST_NOMINEE.email}` }).getByRole('button').click();
  //     await page.getByText('Change Status').click();
  //     await page.getByRole('menuitem', { name: 'Approved' }).click();
  //     await page.getByRole('button', { name: 'Continue' }).waitFor();  // <- wait for element
  //     await page.getByRole('button', { name: 'Continue' }).click();
  
  //     // await expect nominee row's "Status" to change to "Approved"
  //     await expect(
  //       page.getByRole('row', { name: `${TEST_NOMINEE.name} ${TEST_NOMINEE.email}` }).getByRole('cell', { name: 'Approved' }).first()
  //     ).toBeVisible();
  
  //     page.goto("/");
  //     await expect(page.getByText(TEST_NOMINEE.name)).toBeVisible();
  //   });

  //   test('new artist has a website preview image', async ({ page, auth }: { page: Page; auth: any }) => {});

  // })

  // test.describe('artist removed', () => {
  //   test.beforeEach(() => {
  //     //create Nominee
  //     // create artist
  //   })
  //   test.afterEach(() => {
  //     //delete nominee
  //     //delete artist
  //   })
  //   test('rejecting existing artist', ({ page }) => {
  //     // page.goto("/")
  //     // await expect TEST_NOMINEE.name to be on the page
  //     // page.goto("/admin")
  //     // expect nominee status to be "Approved"
  //     // change status to "Rejected"
  //     // await expect nominee row's "Status" to change to "Rejected"
  //     // page.goto("/")
  //     // await expect TEST_NOMINEE.name NOT to be on the page
  //   });
  
  //   test('pending existing artist', async ({ page, auth }: { page: Page; auth: any }) => {
  //     // page.goto("/")
  //     // await expect TEST_NOMINEE.name to be on the page
  //     // page.goto("/admin")
  //     // expect nominee status to be "Approved"
  //     // change status to "Pending"
  //     // await expect nominee row's "Status" to change to "Pending"
  //     // page.goto("/")
  //     // await expect TEST_NOMINEE.name NOT to be on the page
  //   });
  // })
})

