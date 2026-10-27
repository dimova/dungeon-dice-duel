import { getDb } from './db.js';

/**
 * Inserts a new user row.
 * @param {{name: string, username: string, password: string}} user password is expected to already be hashed
 * @returns {Promise<number>} resolves with the new user's id (lastID)
 */
export function createUser({ name, username, password }) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run(
      'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
      [name, username, password],
      function callback(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

/**
 * @param {string} username
 * @returns {Promise<object|null>} resolves with the matching user row, or null
 */
export function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

/**
 * @param {number} id
 * @returns {Promise<object|null>} resolves with the matching user row, or null
 */
export function getUserById(id) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}
