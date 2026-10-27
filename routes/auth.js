import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByUsername } from '../db/users.js';

const router = Router();

const USERNAME_REGEX = /^[A-Za-z0-9_-]{1,20}$/;
const SALT_ROUNDS = 10;

function sanitize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

router.post('/register', async (req, res) => {
  try {
    const name = sanitize(req.body?.name);
    const username = sanitize(req.body?.username);
    const password = sanitize(req.body?.password);

    if (!name || !username || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        error: 'Username must be 1–20 characters, using letters, numbers, _ or -.',
      });
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await createUser({ name, username, password: passwordHash });

    req.session.userId = userId;
    req.session.isAuthenticated = true;

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const username = sanitize(req.body?.username);
    const password = sanitize(req.body?.password);

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await getUserByUsername(username);
    const passwordMatches = user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    res.json({ message: 'Logged in' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  // Destroying the session ends the current run too (no runId carries over).
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

export default router;
