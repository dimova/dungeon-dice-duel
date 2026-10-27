import { Router } from 'express';
import { getUserById } from '../db/users.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    if (!req.session.isAuthenticated || !req.session.userId) {
      return res.json({ isLoggedIn: false });
    }

    const user = await getUserById(req.session.userId);
    if (!user) {
      return res.json({ isLoggedIn: false });
    }

    res.json({ isLoggedIn: true, name: user.name });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
