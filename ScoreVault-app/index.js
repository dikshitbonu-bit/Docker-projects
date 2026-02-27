const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
app.use(express.json());

// ─── DB Connection ────────────────────────────────────────────────────────────
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db',
  port: 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'secret',
  database: process.env.POSTGRES_DB || 'leaderboard',
});

// ─── Redis Connection ─────────────────────────────────────────────────────────
const redisClient = redis.createClient({
  socket: { host: process.env.REDIS_HOST || 'cache', port: 6379 },
});

redisClient.on('error', (err) => console.error('Redis error:', err));

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
  await redisClient.connect();

  // Create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS score_history (
      id         SERIAL PRIMARY KEY,
      player     TEXT NOT NULL,
      score      INTEGER NOT NULL,
      game       TEXT NOT NULL DEFAULT 'default',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('✅ Connected to Postgres + Redis');
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /score — Submit a score
// Body: { player: "Arjun", score: 4200, game: "tetris" }
app.post('/score', async (req, res) => {
  const { player, score, game = 'default' } = req.body;
  if (!player || score === undefined) {
    return res.status(400).json({ error: 'player and score are required' });
  }

  try {
    // 1. Persist to Postgres (permanent history)
    await pool.query(
      'INSERT INTO score_history (player, score, game) VALUES ($1, $2, $3)',
      [player, score, game]
    );

    // 2. Update Redis sorted set — keeps live leaderboard
    //    ZADD only updates if the new score is HIGHER
    const key = `leaderboard:${game}`;
    const current = await redisClient.zScore(key, player);
    if (current === null || score > Number(current)) {
      await redisClient.zAdd(key, { score, value: player });
    }

    res.json({ success: true, message: `Score ${score} recorded for ${player}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /leaderboard/:game — Top 10 live rankings from Redis
app.get('/leaderboard/:game?', async (req, res) => {
  const game = req.params.game || 'default';
  const key = `leaderboard:${game}`;

  try {
    // ZRANGE with REV = highest score first
    const raw = await redisClient.zRangeWithScores(key, 0, 9, { REV: true });

    const rankings = raw.map((entry, i) => ({
      rank: i + 1,
      player: entry.value,
      score: entry.score,
      medal: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ',
    }));

    res.json({ game, leaderboard: rankings, source: 'redis-live' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /history/:player — Full score history from Postgres
app.get('/history/:player', async (req, res) => {
  const { player } = req.params;
  const { game } = req.query;

  try {
    let query = 'SELECT * FROM score_history WHERE player = $1';
    const params = [player];

    if (game) {
      query += ' AND game = $2';
      params.push(game);
    }

    query += ' ORDER BY created_at DESC LIMIT 20';

    const { rows } = await pool.query(query, params);
    res.json({ player, history: rows, source: 'postgres-history' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /stats/:game — Aggregated stats from Postgres
app.get('/stats/:game?', async (req, res) => {
  const game = req.params.game || 'default';

  try {
    const { rows } = await pool.query(
      `SELECT
         player,
         COUNT(*)::int        AS games_played,
         MAX(score)           AS best_score,
         ROUND(AVG(score), 1) AS avg_score,
         MIN(score)           AS worst_score
       FROM score_history
       WHERE game = $1
       GROUP BY player
       ORDER BY best_score DESC`,
      [game]
    );

    res.json({ game, stats: rows, source: 'postgres-aggregated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /health — Healthcheck endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redisClient.ping();
    res.json({ status: 'ok', postgres: 'up', redis: 'up' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', error: err.message });
  }
});

// GET / — API overview
app.get('/', (req, res) => {
  res.json({
    name: ' scorevault API',
    endpoints: {
      'POST /score':              'Submit a score { player, score, game }',
      'GET  /leaderboard/:game':  'Live top-10 rankings (from Redis)',
      'GET  /history/:player':    'Full score history (from Postgres)',
      'GET  /stats/:game':        'Aggregated player stats (from Postgres)',
      'GET  /health':             'Service health check',
    },
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
bootstrap()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
  .catch((err) => { console.error('Startup failed:', err); process.exit(1); });