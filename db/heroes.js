import { getDb } from './db.js';

/**
 * Fetches all hero rows from the `heroes` table.
 * @returns {Promise<object[]>} resolves with an array of hero objects
 */
export function getAllHeroes() {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all('SELECT * FROM heroes', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
