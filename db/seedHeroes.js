/**
 * Seeds the `heroes` table with the hard-coded roster from data/heroes.js.
 * Run with: node db/seedHeroes.js
 */
import { getDb } from './db.js';
import { heroes } from '../data/heroes.js';

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function callback(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

async function seedHeroes() {
  const db = getDb();

  await run(db, 'DELETE FROM heroes');

  for (const hero of heroes) {
    await run(
      db,
      `INSERT INTO heroes (id, name, attackPower, defensePower, maxHp, imageUrl)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [hero.id, hero.name, hero.attackPower, hero.defensePower, hero.maxHp, hero.imageUrl]
    );
  }

  console.log(`Seeded ${heroes.length} heroes.`);
  db.close();
}

seedHeroes().catch((err) => {
  console.error('Failed to seed heroes:', err);
  process.exitCode = 1;
});
