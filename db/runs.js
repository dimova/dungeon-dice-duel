import { getDb } from './db.js';

/**
 * Inserts a new run row for the given user.
 * @param {number} userId
 * @returns {Promise<number>} resolves with the new run's id (lastID)
 */
export function createRun(userId) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run(
      'INSERT INTO runs (user_id) VALUES (?)',
      [userId],
      function callback(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

/**
 * Updates a run's totals after a battle completes.
 * Increments total_battles always, plus wins or losses depending on outcome.
 * @param {number} runId
 * @param {'player_win'|'player_loss'|'draw'} outcome
 * @returns {Promise<number>} resolves with the number of rows changed
 */
export function updateRunStats(runId, outcome) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run(
      `UPDATE runs
       SET total_battles = total_battles + 1,
           wins = wins + CASE WHEN ? = 'player_win' THEN 1 ELSE 0 END,
           losses = losses + CASE WHEN ? = 'player_loss' THEN 1 ELSE 0 END
       WHERE id = ?`,
      [outcome, outcome, runId],
      function callback(err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}
