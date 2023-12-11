import { test, expect } from '@playwright/test';
import { TEST_ARTISTS } from '../lib/firebase/seedData'
import { toSortedByDate, toSortedByGenre, toSortedByName } from '@/lib/utils'
import { Artist } from '@/components/artist-list';

test.describe.only('sorting fns', () => {
  test.use({
    geolocation: {
      latitude: 50.8841204,
      longitude: 4.635328,
    },
  });
    test('sort by date', () => {
      const result = toSortedByDate(TEST_ARTISTS)
      expect(result.map(({ name }) => name)).toEqual([
        'Ada Lovelace',
        'Lily Liu',
        'Johnny Riches',
        'Ibrahim Hopkins',
        'Sofia Wheeler',
        'Conner Garrison',
        'Selima Khalil'
      ])
    });
  test('sort by alphabetical', () => {
    const result = toSortedByName(TEST_ARTISTS)
      expect(result.map(({ name }) => name)).toEqual([
        'Ada Lovelace',
        'Conner Garrison',
        'Ibrahim Hopkins',
        'Johnny Riches',
        'Lily Liu',
        'Selima Khalil',
        'Sofia Wheeler',
      ])
  });

  test.skip('sort by location', async ({ page }) => {
    page.goto('/')
    await page.getByRole('combobox').click();
    await page.getByLabel('Near Me').click();
    await page.evaluate(`
      navigator.geolocation.getCurrentPosition = (successCallback, errorCallback, options) => {
        errorCallback({ code: 1, message: 'Permission denied' });
      };
    `, { coords: { "latitude": 37.8043514, "longitude": -122.2711639} });
  });

  test('sort by genre', () => {
    const result = toSortedByGenre(TEST_ARTISTS)

    // result obj should have 13 genres/keys
    expect(Object.keys(result).length).toBe(13)

    // Sculpture should have both Johnny Riches and Ada Lovelace
    expect(result['Sculpture'].map(({ name }: Artist) => name))
      .toEqual(['Johnny Riches', 'Ada Lovelace'])

    // Ada Lovelace should appear under performance, installation, and Sculpture
    Array('Performance', 'Installation', 'Sculpture').forEach((genre) => {
      expect(result[genre].some(({ name }: Artist) => (name === 'Ada Lovelace'))).toBeTruthy();
    })
  });
})