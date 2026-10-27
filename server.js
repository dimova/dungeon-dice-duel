import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import diceGameRoutes from './routes/diceGameRoutes.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    // TODO: move to an environment variable before deploying.
    secret: process.env.SESSION_SECRET || 'dungeon-dice-dev-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth/me', meRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', diceGameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
