import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import {mysteries} from '../shared/mysteries';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

const NORMAL_XP = 50;
const FIRST_XP = 250;

export async function update_xp(username: string, delta: number) {
  const new_xp = await redis.zIncrBy("leaderboard:xp", username, delta);
  return Number(new_xp);
}

export async function get_xp(username: string) {
  const xp = await redis.zScore("leaderboard:xp", username);
  return xp ? Number(xp) : 0;
}

export async function get_leaderboard_top10() {
  const all = await redis.zRange("leaderboard:xp", 0, -1);

  const formatted = all
    .sort((a, b) => b.score - a.score) // descending
    .slice(0, 10)
    .map(e => ({ username: e.member, xp: e.score }));

  return formatted;
}

export async function get_user_rank(username: string) {
  const total = await redis.zCard("leaderboard:xp");
  const rankAsc = await redis.zRank("leaderboard:xp", username); // returns number | null

  if (rankAsc === undefined) return null;

  return total - rankAsc;
}


async function get_fragment(username: string){
  const fragmentInDB = await redis.get(`fragment:${username}`); // fragment is 0-2

  if (fragmentInDB) {
    return parseInt(fragmentInDB);
  }

  const fragment = Math.floor(Math.random() * 3) // random number between 0 and 2
  await redis.set(`fragment:${username}`, String(fragment));
  return fragment;
}

// Helper to add XP for first/normal submission
async function handleFirstAndDone(
  username: string,
  doneKey: string,
  firstKey: string
): Promise<{ xpGained: number; first: boolean; alreadyDone: boolean }> {
  // Check if user already submitted
  const alreadyDone = (await redis.hGet(doneKey, username)) !== null;
  if (alreadyDone) return { xpGained: 0, first: false, alreadyDone: true };

  let xpGained = NORMAL_XP;
  let first = false;

  // Check if anyone has submitted first
  const firstPerson = await redis.get(firstKey);
  if (!firstPerson) {
    await redis.set(firstKey, username);
    xpGained = FIRST_XP;
    first = true;
  }

  // Mark user as done
  await redis.hSet(doneKey, { [username]: "1" });
  // Give XP
  await redis.zIncrBy("leaderboard:xp", username, xpGained);

  return { xpGained, first, alreadyDone: false };
}

export async function add_fragment_clue(
  username: string,
  mysteryId: string,
  location: string
) {
  const fragmentId = await get_fragment(username);
  const doneKey = `fragment_done:${mysteryId}:${location}:${fragmentId}`;
  const firstKey = `fragment_first:${mysteryId}:${location}:${fragmentId}`;

  return handleFirstAndDone(username, doneKey, firstKey);
}

export async function get_fragment_status(
  username: string,
  mysteryId: string,
  location: string
) {
  const fragmentId = await get_fragment(username);
  const doneKey = `fragment_done:${mysteryId}:${location}:${fragmentId}`;
  const firstKey = `fragment_first:${mysteryId}:${location}:${fragmentId}`;

  const done = (await redis.hGet(doneKey, username)) !== null;
  const firstPerson = await redis.get(firstKey);
  const first = firstPerson === username;

  return { fragmentId, done, first };
}

export async function add_location_clue(
  username: string,
  mysteryId: string,
  location: string
) {
  const doneKey = `location_done:${mysteryId}:${location}`;
  const firstKey = `location_first:${mysteryId}:${location}`;

  return handleFirstAndDone(username, doneKey, firstKey);
}

export async function get_location_status(
  username: string,
  mysteryId: string,
  location: string
) {
  const doneKey = `location_done:${mysteryId}:${location}`;
  const firstKey = `location_first:${mysteryId}:${location}`;

  const done = (await redis.hGet(doneKey, username)) !== null;
  const firstPerson = await redis.get(firstKey);
  const first = firstPerson === username;

  return { done, first };
}

export async function add_main_clue(username: string, mysteryId: string) {
  const doneKey = `main_done:${mysteryId}`;
  const firstKey = `main_first:${mysteryId}`;

  return handleFirstAndDone(username, doneKey, firstKey);
}

export async function get_main_status(username: string, mysteryId: string) {
  const doneKey = `main_done:${mysteryId}`;
  const firstKey = `main_first:${mysteryId}`;

  const done = (await redis.hGet(doneKey, username)) !== null;
  const firstPerson = await redis.get(firstKey);
  const first = firstPerson === username;

  return { done, first };
}


router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [usernameInDB] = await Promise.all([
        reddit.getCurrentUsername()
      ])

      const username = usernameInDB ?? 'anonymous'

      const xp = await get_xp(username)
      const fragment = await get_fragment(username)

      res.json({
        type: 'init',
        postId: postId,
        xp: xp,
        username: username ?? 'anonymous',
        fragment: fragment
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post('/api/fragment', async (req, res) => {
  const { username } = await reddit.getCurrentUsername().then(u => ({ username: u ?? 'anonymous' }));
  const { mysteryId, location, selectedObjects, answer } = req.body;

  if (!mysteryId || !location || !Array.isArray(selectedObjects) || !answer) {
    return res.status(400).json({ correct: false, message: 'Invalid request body' });
  }

  // Rate limit (1 attempt per minute)
  const rateKey = `ratelimit:${username}:${mysteryId}:${location}:fragment`;
  const lastAttempt = await redis.get(rateKey);
  if (lastAttempt) {
    return res.status(429).json({ correct: false, message: 'You can only try once per minute' });
  }

  await redis.set(rateKey, '1');
  await redis.expire(rateKey, 60);

  // Get fragment group for user (A/B/C)
  const fragmentId = await get_fragment(username);

  // Fetch the mystery data (assuming you import or have it available)
  const mystery = mysteries[mysteryId];
  if (!mystery) {
    return res.status(404).json({ correct: false, message: 'Mystery not found' });
  }

  const loc = mystery.locations.find(l => l.name === location);
  if (!loc) {
    return res.status(404).json({ correct: false, message: 'Location not found' });
  }

  const fragmentCode = loc.fragment_codes[fragmentId]; // e.g. "LAW"
  const correctObjects = loc.objects
    .filter(o => o.real && o.messages[fragmentId]) // assuming fragmentId = 0,1,2
    .map(o => o.id);

  // Check correctness
  const objectsMatch =
    selectedObjects.length === correctObjects.length &&
    selectedObjects.every(id => correctObjects.includes(id));

  const answerCorrect = answer.trim().toUpperCase() === String(fragmentCode).toUpperCase();

  if (!objectsMatch || !answerCorrect) {
    return res.json({ correct: false, message: 'Incorrect fragment clue or objects' });
  }

  // Award XP + first-solver logic
  const { xpGained, first } = await add_fragment_clue(username, mysteryId, location);

  return res.json({
    correct: true,
    message: first
      ? `You solved it first! +${xpGained} XP`
      : `Correct! +${xpGained} XP`,
    xpGained,
    first,
  });
});

router.get('/api/progress', async (req, res) => {
  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const { mysteryId } = req.query;

    if (!mysteryId || typeof mysteryId !== 'string') {
      return res.status(400).json({ error: 'mysteryId is required' });
    }

    const mystery = mysteries[mysteryId];
    if (!mystery) return res.status(404).json({ error: 'Mystery not found' });

    const progress: Record<number, { fragment: boolean; location: boolean }> = {};

    for (let i = 0; i < mystery.locations.length; i++) {
      const loc = mystery.locations[i];

      const fragmentStatus = await get_fragment_status(username, mysteryId, loc.name);
      const locationStatus = await get_location_status(username, mysteryId, loc.name);

      progress[i] = { fragment: fragmentStatus.done, location: locationStatus.done };
    }

    res.json(progress);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy(`xp:{username}`, 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
