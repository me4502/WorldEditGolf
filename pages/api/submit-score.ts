import { addLeaderboard } from '../../src/dynamoDb';
import { withAuth } from '../../src/auth';
import safeCompare from 'safe-compare';

const EXPECTED_KEY = process.env.BROKER_API_KEY;

const handler = withAuth(async (req, res) => {
    const { api_key, golfId, score, commands } = req.body;

    if (!safeCompare(api_key, EXPECTED_KEY)) {
        res.status(403);
        res.end(`Invalid API Key`);
        return;
    }

    try {
        await addLeaderboard({
            golf_id: golfId,
            score: score,
            user_id: req.githubId,
            commands,
            submitted_time: Date.now()
        });
        res.end('Score submitted');
    } catch (e) {
        res.status(501);
        res.end('Failed to submit score');
    }
});

export default handler;
