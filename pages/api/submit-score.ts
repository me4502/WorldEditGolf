import { addLeaderboard, unhideGolf } from '../../src/dynamoDb';
import { withAuth } from '../../src/auth';

const EXPECTED_KEY = process.env.BROKER_API_KEY;

const handler = withAuth(async (req, res) => {
  const { api_key, golfId, score, commands, initial } = req.body;

  if (api_key !== EXPECTED_KEY) {
    res.end(403, 'Invalid API Key');
    return;
  }

  if (initial) {
      await unhideGolf(golfId);
  }

  try {
    await addLeaderboard({
      golf_id: golfId,
      score: score,
      user_id: req.githubId,
      commands,
      date: Date.now()
    });
    res.end('Score submitted');
  } catch (e) {
    res.end(501, 'Failed to submit score');
  }
});

export default handler;
