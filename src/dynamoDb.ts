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

export async function getGolf(golfId: string): Promise<Golf> {
    if (process.env.NODE_ENV !== 'production' && golfId === 'test') {
        return Promise.resolve({
            golf_id: 'test',
            start_schematic:
                'H4sIAAAAAAAAAF1OXUvDQBCc3GHTnIr/wZ8h2Aex4INFQbF+IGVNN8lieoHcgvrqH/Wn6J4KFedl2JndmQ2oruqON6RSe4RL6lmVF/QKwAeUv4LHwUYi1yM1epR0iGy+89jfqiSjaYXH4VZrR0pp9dQP9fNDisPL23FDfeJHZHiUNzwmGWK+c5icc2y1gwuYLlhpTUoe1XJ+0TSJ9fbT8Ge++zfff4dazBlL2ylcieokN59ajjnTbBdF4Rx2lrLORRX2rqXneVRR4RTyxi4mP3n5Q2v4MJ4Zv+MLMXi6PSsBAAA=',
            test_schematic:
                'H4sIAAAAAAAAA11P20rEQAw9ncHtdrx8hJ8h6IO44IOLguJ6QSS2aRvsTqETUF/9UT9FM6ywYiAk53BykgRU13XPa1KpS1Snw1i/npESgLkliqJwDrNzlq5X5PaCY6c9XMB8yUqNiT2q1eKybRPr3bfFH3z/Dz9kU+xitoHWexN8WT2x+hlQXtHAquyxv5bI9UStHpFM+RaPwy3XTZTS80s++DHF8e3juKUh8VP29zjYChPFxjhnbPg1X9J7VlXYu5GBF1FFhVPYjJa3PCUZY97osLOSJr+LH/Ay+vAqAQAA',
            isHidden: false,
            title: 'Test Golf',
            description: 'A test golf',
            created_at: Date.now(),
            user_id: 'test'
        });
    }
    const readParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: GolfsTableName,
        Key: {
            golf_id: golfId
        }
    };

    return new Promise((resolve, reject) => {
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
                date: Date.now()
            },
            {
                golf_id: 'test',
                user_id: 'test3',
                score: 2,
                commands: '//replace stone cake\n//replace cake sand',
                date: Date.now()
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

    return new Promise((resolve, reject) => {
        docClient.query(queryParams, (err, data) => {
            if (err || !data || !data.Items) {
                reject(err);
            } else {
                resolve(data.Items as GolfLeaderboard[]);
            }
        });
    });
}

export async function addGolf(golf: Golf): Promise<void> {
    const createParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: GolfsTableName,
        Item: golf
    };

    return new Promise((resolve, reject) => {
        docClient.put(createParams, (err, _data) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function unhideGolf(golfId: string): Promise<void> {
    const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: GolfsTableName,
        Key: {
            golf_id: golfId
        },
        UpdateExpression: `set isHidden=:isHidden`,
        ExpressionAttributeValues: {
            ':isHidden': false
        }
    };

    return new Promise((resolve, reject) => {
        docClient.update(updateParams, (err, _data) => {
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
    const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: LeaderboardTableName,
        Key: {
            golf_id: leaderboard.golf_id,
            user_id: leaderboard.user_id
        },
        UpdateExpression: `set commands=:commands, score=:score, date=:date`,
        ExpressionAttributeValues: {
            ':commands': leaderboard.commands,
            ':score': leaderboard.score,
            ':date': leaderboard.date
        }
    };

    return new Promise((resolve, reject) => {
        docClient.update(updateParams, (err, _data) => {
            if (err) {
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
            user_id: user.user_id
        },
        UpdateExpression: `set avatar=:avatar, username=:username, name=:name`,
        ExpressionAttributeValues: {
            ':avatar': user.avatar,
            ':username': user.username,
            ':name': user.name
        }
    };

    return new Promise((resolve, reject) => {
        docClient.update(updateParams, (err, _data) => {
            if (err) {
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
            name: 'Test Testerson',
            username: 'test2',
            avatar:
                'https://enginehub.org/static/f424a77f87272f1081deb39d11e08bf4/4da7c/worldedit-icon.png'
        });
    }
    const readParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: UsersTableName,
        Key: {
            user_id: userId
        }
    };

    return new Promise((resolve, reject) => {
        docClient.get(readParams, (err, data) => {
            if (err || !data || !data.Item) {
                reject(err);
            } else {
                resolve(data.Item as User);
            }
        });
    });
}
