import { NextApiRequest, NextApiResponse } from 'next-server/dist/lib/utils';
import { getAllGolfs } from '../../src/dynamoDb';

export const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(400);
        res.end();
        return;
    }

    try {
        const golfs = await getAllGolfs();
        res.status(200);
        res.write(JSON.stringify(golfs));
        res.end();
        return;
    } catch (e) {
        res.status(500);
        res.write(JSON.stringify({ error: e }));
        res.end();
        return;
    }
};
