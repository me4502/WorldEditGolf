import { NextApiRequest, NextApiResponse } from 'next';

const EXPECTED_KEY = process.env.BROKER_API_KEY;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { api_key, token: _token, golfId: _golfId } = req.body;

    if (api_key !== EXPECTED_KEY) {
        res.end(403, 'Invalid API Key');
        return;
    }

    res.end('Score submitted');
}
