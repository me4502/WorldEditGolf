import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const PasteTableName = 'Pastes';

export function createTable() {
    const createParams: AWS.DynamoDB.CreateTableInput = {
        TableName: PasteTableName,
        KeySchema: [
            {
                AttributeName: 'paste_id',
                KeyType: 'HASH'
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'paste_id',
                AttributeType: 'S'
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    };

    dynamoDB.createTable(
        createParams,
        (err: AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput) => {
            if (err) {
                console.error(
                    'Failed to create table. ',
                    JSON.stringify(err, null, 2)
                );
            } else {
                console.log('Created table. ', JSON.stringify(data, null, 2));
            }
        }
    );
}

// 1 Month
const EXPIRY_TIME = 60 * 60 * 24 * 31 * 1;

export async function createPaste(
    content: string,
    from?: string
): Promise<string> {
    const created_at = Math.floor(Date.now() / 1000);
    const ttl = created_at + EXPIRY_TIME;
    let ip = global['clientIp'];
    const id = '';
    const createParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: PasteTableName,
        Item: {
            paste_id: id,
            ip_address: ip,
            content: content,
            ttl,
            created_at,
            from
        }
    };

    return new Promise((resolve, reject) => {
        docClient.put(createParams, (err, _data) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
}

export async function getPaste(paste_id: string): Promise<string> {
    const readParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: PasteTableName,
        Key: {
            paste_id
        }
    };

    return new Promise((resolve, reject) => {
        docClient.get(readParams, (err, data) => {
            if (err || !data || !data.Item) {
                reject(err);
            } else {
                resolve(data.Item.content);
            }
        });
    });
}
