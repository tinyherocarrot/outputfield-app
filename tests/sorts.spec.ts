import { test, expect } from '@playwright/test';
import { TEST_ARTISTS } from '@/lib/firebase/seedData'
import { toSortedByDate, toSortedByDistance, toSortedByGenre, toSortedByName } from '@/lib/utils'
import { Artist } from '@/ts/interfaces/artist.interfaces';

test.describe('sorting fns', () => {
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

  test('sort by location', () => {
    const position = {
      coords: { 
        "latitude": 37.8043514,
        "longitude": -122.2711639,
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0, 
        speed: 0
      },
      timestamp: Date.now()
    };
    const result = toSortedByDistance(position, TEST_ARTISTS)
    expect(result.map(({ name }) => name)).toEqual([
      'Lily Liu',
      'Ada Lovelace',
      'Johnny Riches',
      'Ibrahim Hopkins',
      'Sofia Wheeler',
      'Selima Khalil',
      'Conner Garrison',
    ])
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