type BrokerStatus = 'queued' | 'errored' | 'failed' | 'passed' | 'running';

const BROKER_API_HOSTNAME =
    process.env.BROKER_API_HOSTNAME || 'http://localhost:4653';

interface QueueRequest {
    input: string;
    test: string;
    script: string;
    golfId: string;
    token: string;
    initial: boolean;
}

interface QueueResponse {
    taskId: string;
}

interface PollResponse {
    status: BrokerStatus;
    positionInQueue?: number;
    log?: string;
    reason?: string;
    result?: string;
}

export async function queueTask(request: QueueRequest): Promise<QueueResponse> {
    return (await fetch(`${BROKER_API_HOSTNAME}/queue`, {
        method: 'post',
        body: JSON.stringify(request),
        headers: {
            authorization: 'token ' + request.token
        }
    })).json();
}

export async function clearTask(taskId: string): Promise<void> {
    await fetch(`${BROKER_API_HOSTNAME}/clear/${taskId}`, {
        method: 'post'
    });
}

export async function pollBroker(taskId: string): Promise<PollResponse> {
    return (await fetch(`${BROKER_API_HOSTNAME}/poll/${taskId}`)).json();
}
