# Dungeon Dice Duel

A dice-based hero battler. Pick a hero, start a battle, roll rounds against a random
opponent, and track your wins/losses — as a guest or as a registered player.

## Prerequisites

- [Node.js](https://nodejs.org/) (tested on v24)
- npm (comes with Node.js)

## Getting started

1. **Install dependencies** (only needed once, or after pulling changes that touch
   `package.json`):

   ```bash
   npm install
   ```

2. **Seed the heroes table** (only needed once — or again if you ever delete the
   database file):

   ```bash
   npm run seed
   ```

3. **Start the server**:

   ```bash
   npm start
   ```

   This runs `node server.js`, which listens on port `3000` by default (or the port
   set in the `PORT` environment variable).

4. **Open the app** in your browser at [http://localhost:3000](http://localhost:3000)

To stop the server, press `Ctrl+C` in the terminal where it's running.

## Notes

- The SQLite database file lives at `db/dungeonDice.sqlite` and is created
  automatically (with all required tables) the first time the server starts.
  `npm run seed` populates the `heroes` table from `data/heroes.js`.
- You can play immediately as a guest, or use **Register**/**Sign in** from the
  header menu to track your wins/losses under your own account.

## Project structure

```
server.js              Express app entry point
public/                Static frontend (HTML, CSS, client-side JS)
routes/                Express route handlers (game, auth)
domain/                Game engine logic (dice rolls, battle rules)
db/                     SQLite connection, schema, and query helpers
data/                  Hard-coded hero roster used to seed the database
```

## Available scripts

| Script         | Description                                  |
| -------------- | --------------------------------------------- |
| `npm start`    | Start the Express server                      |
| `npm run seed` | Seed/reset the `heroes` table from `data/heroes.js` |
