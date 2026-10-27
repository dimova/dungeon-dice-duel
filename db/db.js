import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite = sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'dungeonDice.sqlite');

const CREATE_HEROES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS heroes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    attackPower INTEGER NOT NULL,
    defensePower INTEGER NOT NULL,
    maxHp INTEGER NOT NULL,
    imageUrl TEXT
  )
`;

const CREATE_RUNS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_battles INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const CREATE_USERS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

let db = null;

/**
 * Returns a shared SQLite database connection, creating the `heroes`,
 * `runs` and `users` tables on first use if they don't already exist.
 */
export function getDb() {
  if (!db) {
    db = new sqlite.Database(DB_PATH);
    // Serialize so table creation always runs before later queued queries.
    db.serialize();
    db.run(CREATE_HEROES_TABLE_SQL);
    db.run(CREATE_RUNS_TABLE_SQL);
    db.run(CREATE_USERS_TABLE_SQL);
  }

  return db;
}
