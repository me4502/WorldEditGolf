import {NextApiRequest, NextApiResponse} from 'next-server/dist/lib/utils';
import jwt from 'jsonwebtoken';

type Handler<T = {}> = (req: NextApiRequest & T, res: NextApiResponse) => Promise<void>;

export type AuthenticatedHandler = Handler<{githubId: string}>;

export interface DecodedToken {
    githubId: string;
}

export function isDecodedToken(decoded: object): decoded is DecodedToken {
    return 'githubId' in decoded;
}

const verifyToken = (token: string) => new Promise<DecodedToken>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (decoded) {
            if (typeof decoded === 'string') {
                decoded = JSON.parse(decoded) as object;
            }

            if (isDecodedToken(decoded)) {
                resolve(decoded);
            } else {
                reject(new Error("Token was not a valid token!"));
            }
        } else {
            reject(error);
        }
    });
});

export const withAuth: (handler: AuthenticatedHandler) => Handler = handler => {
    return async (req, res) => {
        const prefix = 'token ';
        if (req.headers.authorization && req.headers.authorization.startsWith(prefix)) {
            const token = req.headers.authorization.slice(prefix.length);
            try {
                const {githubId} = await verifyToken(token);
                (req as any).githubId = githubId;
                return handler(req as any, res);
            } catch (e) {
                console.error(e);
            }
        }
        res.status(401);
        res.end();
        return Promise.resolve();
    };
}
