import AWS from 'aws-sdk';
import { Golf, GolfLeaderboard } from './types/database';

AWS.config.update({
  region: 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const GolfsTableName = 'WorldEditGolfs';
const LeaderboardTableName = 'WorldEditGolfsLeaderboard';

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

  dynamoDB.createTable(
    golfsCreateParams,
    (err: AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput) => {
      if (err) {
        console.error('Failed to create table. ', JSON.stringify(err, null, 2));
      } else {
        console.log('Created table. ', JSON.stringify(data, null, 2));
      }
    }
  );

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

  dynamoDB.createTable(
    leaderboardCreateParams,
    (err: AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput) => {
      if (err) {
        console.error('Failed to create table. ', JSON.stringify(err, null, 2));
      } else {
        console.log('Created table. ', JSON.stringify(data, null, 2));
      }
    }
  );
}

export async function getGolf(golfId: string): Promise<Golf> {
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
    UpdateExpression: `set hidden=:hidden`,
    ExpressionAttributeValues: {
      ':hidden': false
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
