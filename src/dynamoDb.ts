import AWS from 'aws-sdk';
import { Golf, GolfLeaderboard, User } from './types/database';

AWS.config.update({
    region: 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const GolfsTableName = 'WorldEditGolfs';
const LeaderboardTableName = 'WorldEditGolfsLeaderboard';
const UsersTableName = 'WorldEditGolfUsers';

export function createTable() {
    const golfsCreateParams: AWS.DynamoDB.CreateTableInput = {
        TableName: GolfsTableName,
        KeySchema: [
            {
                AttributeName: 'golf_id',
                KeyType: 'HASH'
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'golf_id',
                AttributeType: 'S'
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    };

    const leaderboardCreateParams: AWS.DynamoDB.CreateTableInput = {
        TableName: LeaderboardTableName,
        KeySchema: [
            {
                AttributeName: 'golf_id',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'user_id',
                KeyType: 'RANGE'
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'golf_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'user_id',
                AttributeType: 'S'
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    };

    const usersCreateParams: AWS.DynamoDB.CreateTableInput = {
        TableName: UsersTableName,
        KeySchema: [
            {
                AttributeName: 'user_id',
                KeyType: 'HASH'
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'user_id',
                AttributeType: 'S'
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    };

    const createParams = [
        golfsCreateParams,
        leaderboardCreateParams,
        usersCreateParams
    ];

    for (const createParam of createParams) {
        dynamoDB.createTable(
            createParam,
            (err: AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput) => {
                if (err) {
                    console.error(
                        'Failed to create table. ',
                        JSON.stringify(err, null, 2)
                    );
                } else {
                    console.log(
                        'Created table. ',
                        JSON.stringify(data, null, 2)
                    );
                }
            }
        );
    }
}

const TEST_GOLF = {
    golf_id: 'test',
    start_schematic:
        'H4sIAAAAAAAAAF1OXUvDQBCc3GHTnIr/wZ8h2Aex4INFQbF+IGVNN8lieoHcgvrqH/Wn6J4KFedl2JndmQ2oruqON6RSe4RL6lmVF/QKwAeUv4LHwUYi1yM1epR0iGy+89jfqiSjaYXH4VZrR0pp9dQP9fNDisPL23FDfeJHZHiUNzwmGWK+c5icc2y1gwuYLlhpTUoe1XJ+0TSJ9fbT8Ge++zfff4dazBlL2ylcieokN59ajjnTbBdF4Rx2lrLORRX2rqXneVRR4RTyxi4mP3n5Q2v4MJ4Zv+MLMXi6PSsBAAA=',
    test_schematic:
        'H4sIAAAAAAAAA11P20rEQAw9ncHtdrx8hJ8h6IO44IOLguJ6QSS2aRvsTqETUF/9UT9FM6ywYiAk53BykgRU13XPa1KpS1Snw1i/npESgLkliqJwDrNzlq5X5PaCY6c9XMB8yUqNiT2q1eKybRPr3bfFH3z/Dz9kU+xitoHWexN8WT2x+hlQXtHAquyxv5bI9UStHpFM+RaPwy3XTZTS80s++DHF8e3juKUh8VP29zjYChPFxjhnbPg1X9J7VlXYu5GBF1FFhVPYjJa3PCUZY97osLOSJr+LH/Ay+vAqAQAA',
    title: 'Test Golf',
    description: 'A test golf',
    created_at: Date.now(),
    user_id: 'test'
};

export async function getGolf(golfId: string): Promise<Golf> {
    if (process.env.NODE_ENV !== 'production' && golfId === 'test') {
        return Promise.resolve(TEST_GOLF);
    }
    const readParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: GolfsTableName,
        Key: {
            golf_id: golfId
        }
    };

    return await new Promise((resolve, reject) => {
        docClient.get(readParams, (err, data) => {
            if (err || !data || !data.Item) {
                reject(err);
            } else {
                resolve(data.Item as Golf);
            }
        });
    });
}

export async function getLeaderboard(
    golfId: string
): Promise<GolfLeaderboard[]> {
    if (process.env.NODE_ENV !== 'production' && golfId === 'test') {
        return Promise.resolve([
            {
                golf_id: 'test',
                user_id: 'test2',
                score: 1,
                commands: '//replace stone sand',
                submitted_time: Date.now()
            },
            {
                golf_id: 'test',
                user_id: 'test3',
                score: 2,
                commands: '//replace stone cake\n//replace cake sand',
                submitted_time: Date.now()
            }
        ]);
    }
    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: LeaderboardTableName,
        ExpressionAttributeValues: {
            ':golfId': golfId
        },
        KeyConditionExpression: `golf_id = :golfId`
    };

    return await new Promise((resolve, reject) => {
        docClient.query(queryParams, (err, data) => {
            if (err || !data || !data.Items) {
                reject(err);
            } else {
                resolve(data.Items as GolfLeaderboard[]);
            }
        });
    });
}

export async function getSingleLeaderboard(
    golfId: string,
    userId: string
): Promise<GolfLeaderboard> {
    if (process.env.NODE_ENV !== 'production') {
        return Promise.resolve({
            golf_id: golfId,
            user_id: userId,
            score: 1,
            commands: '//replace stone sand',
            submitted_time: Date.now()
        });
    }
    const queryParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: LeaderboardTableName,
        Key: {
            golf_id: golfId,
            user_id: `${userId}`
        }
    };

    return await new Promise((resolve, reject) => {
        docClient.get(queryParams, (err, data) => {
            if (err || !data || !data.Item) {
                reject(err);
            } else {
                resolve(data.Item as GolfLeaderboard);
            }
        });
    });
}

export async function getAllGolfs(): Promise<Golf[]> {
    if (process.env.NODE_ENV !== 'production') {
        return Promise.resolve([TEST_GOLF, TEST_GOLF, TEST_GOLF]);
    }

    const queryParams: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: GolfsTableName
    };

    return await new Promise((resolve, reject) => {
        docClient.scan(queryParams, (err, data) => {
            if (err || !data || !data.Items) {
                reject(err);
            } else {
                resolve(data.Items as Golf[]);
            }
        });
    });
}

export async function addGolf(golf: Golf): Promise<void> {
    const createParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: GolfsTableName,
        Item: golf
    };

    return await new Promise((resolve, reject) => {
        docClient.put(createParams, (err, _data) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function addLeaderboard(
    leaderboard: GolfLeaderboard
): Promise<void> {
    let existingEntry = undefined;
    try {
        existingEntry = await getSingleLeaderboard(leaderboard.golf_id, leaderboard.user_id);
    } catch (e) {
    }
    if (existingEntry && existingEntry.score <= leaderboard.score) {
        // Don't add a score worse than their best
        return Promise.resolve();
    }
    const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: LeaderboardTableName,
        Key: {
            golf_id: `${leaderboard.golf_id}`,
            user_id: `${leaderboard.user_id}`
        },
        UpdateExpression: `set commands=:commands, score=:score, submitted_time=:submitted_time`,
        ExpressionAttributeValues: {
            ':commands': leaderboard.commands,
            ':score': leaderboard.score,
            ':submitted_time': leaderboard.submitted_time
        }
    };

    return await new Promise((resolve, reject) => {
        docClient.update(updateParams, (err, _data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function addUser(user: User): Promise<void> {
    const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: UsersTableName,
        Key: {
            user_id: `${user.user_id}`
        },
        UpdateExpression: `set avatar=:avatar, username=:username, fullname=:fullname`,
        ExpressionAttributeValues: {
            ':avatar': user.avatar,
            ':username': user.username,
            ':fullname': user.fullname
        }
    };

    return await new Promise((resolve, reject) => {
        docClient.update(updateParams, (err, _data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function getUser(userId: string): Promise<User> {
    if (process.env.NODE_ENV !== 'production') {
        return Promise.resolve({
            user_id: userId,
            fullname: 'Test Testerson',
            username: 'test2',
            avatar:
                'https://enginehub.org/static/f424a77f87272f1081deb39d11e08bf4/4da7c/worldedit-icon.png'
        });
    }
    const readParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: UsersTableName,
        Key: {
            user_id: `${userId}`
        }
    };

    return await new Promise((resolve, reject) => {
        docClient.get(readParams, (err, data) => {
            if (err || !data || !data.Item) {
                reject(err);
            } else {
                resolve(data.Item as User);
            }
        });
    });
}
