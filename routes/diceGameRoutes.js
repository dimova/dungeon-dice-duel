import { Router } from 'express';
import { createDiceGameEngine } from '../domain/diceGameEngine.js'
import { getAllHeroes } from '../db/heroes.js';
import { createRun, updateRunStats } from '../db/runs.js';

const heroes = await getAllHeroes();
const engine = createDiceGameEngine(heroes);

const router = Router();

router.get('/heroes', (req, res) => {
  const heroes = engine.getHeroes();
  res.json({ heroes });
});

router.post('/battle/start', async (req, res) => {
  const { heroId } = req.body ?? {};

  if (heroId === undefined || heroId === null) {
    return res.status(400).json({ message: 'Hero ID is required' });
  }

  const result = engine.startBattle(heroId);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  // Epic 3 will replace this with the authenticated user's id.
  if (!req.session.userId) {
    req.session.userId = 1;
  }

  // A run spans the whole play session; only start a new one if none exists yet.
  if (!req.session.runId) {
    req.session.runId = await createRun(req.session.userId);
  }

  res.json({ ...result, message: 'Battle started. Roll to attack!' });
});

router.post('/battle/round', async (req, res) => {
  const result = engine.playRound();

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  if (result.outcome !== 'ongoing' && req.session.runId) {
    await updateRunStats(req.session.runId, result.outcome);
  }

  res.json(result);
});

router.post('/battle/reset', (req, res) => {
  // Reset abandons the in-progress battle; no outcome is logged to runs.
  engine.resetBattle();
  res.json({ message: 'Battle reset.' });
});

export default router;

