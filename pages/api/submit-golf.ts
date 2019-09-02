import { addGolf } from '../../src/dynamoDb';
import { withAuth } from '../../src/auth';
import shortid from 'shortid';

interface Body {
    title: string;
    description: string;
    start_schematic: string;
    test_schematic: string;
}

const handler = withAuth(async (req, res) => {
    if (req.method !== 'POST') {
        res.end();
        return;
    }

    const fields: (keyof Body)[] = [
        'title',
        'start_schematic',
        'test_schematic',
        'description'
    ];

    const data = fields.reduce(
        (acc, a) => {
            acc[a] = req.body[a];
            return acc;
        },
        {} as Partial<Body>
    );

    for (const field of fields) {
        if (!data[field]) {
            res.status(400);
            res.write(
                JSON.stringify({ error: `Field "${field}" missing in body` })
            );
            res.end();
            return;
        }
    }

    const { title, start_schematic, test_schematic, description } = data;
    const golf_id = shortid();

    try {
        await addGolf({
            title,
            start_schematic,
            test_schematic,
            description,
            isHidden: true,
            golf_id,
            user_id: req.githubId,
            created_at: Date.now()
        });

        res.status(200);
        res.write(JSON.stringify({ golf_id }));
        res.end();
        return;
    } catch (e) {
        console.error('Golf', golf_id, 'failed to create');

        res.status(500);
        res.write(JSON.stringify({ error: e }));
        res.end();
        return;
    }
});

export default handler;
