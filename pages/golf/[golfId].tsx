import React, { useEffect, useState, useRef } from 'react';
import { NextPageContext } from 'next-server/dist/lib/utils';
import { Layout } from '../../src/containers/Layout/Layout';
import Head from 'next/head';
import { getGolf, getLeaderboard } from '../../src/dynamoDb';
import { Golf, GolfLeaderboard } from '../../src/types/database';
import Router from 'next/router';
import {
    LeaderboardEntry,
    Leaderboard
} from '../../src/components/Leaderboard/Leaderboard';
import styled from 'styled-components';
import { pollBroker, queueTask, clearTask } from '../../src/broker';
import PrimaryTheme from '../../src/components/style/theme';

interface DocumentProps {
    golf: Golf;
    leaderboards: GolfLeaderboard[];
}

const PageColumns = styled.div`
    display: flex;
`;

const MainContent = styled.div`
    flex: 60%;
`;

const PreviewBox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const SideLeaderboard = styled(Leaderboard)`
    flex: 35%;
    margin-left: 1rem;
`;

const FancyButton = styled.button`
    background-color: ${PrimaryTheme.brandColor};
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
`;

const BaseTextStyle = styled.textarea`
    width: 100%;
    resize: none;
    height: 200px;
    font-size: 1.3rem;
    line-height: 1.5;
`;

const CommandBox = styled(BaseTextStyle)``;

const StatusBox = styled(BaseTextStyle)``;

function Document({ golf, leaderboards }: DocumentProps) {
    const [taskId, setTaskId] = useState(undefined);
    const commandBox = useRef<HTMLTextAreaElement>(null);
    const statusBox = useRef<HTMLTextAreaElement>(null);

    const cleanupTask = async (taskId: string) => {
        // Cleanup the broker
        await clearTask(taskId);
        setTaskId(undefined);
    };

    useEffect(() => {
        const timeout = setInterval(async () => {
            if (taskId) {
                const pollResponse = await pollBroker(taskId);
                switch (pollResponse.status) {
                    case 'queued':
                        statusBox.current!.value = `Queued. Position in queue: ${pollResponse.positionInQueue}`;
                        break;
                    case 'running':
                        statusBox.current!.value = `Currently running... Please wait.`;
                        break;
                    case 'passed':
                        statusBox.current!.value = `Passed!\n\n${pollResponse.log}`;
                        await cleanupTask(taskId);
                        break;
                    case 'failed':
                        statusBox.current!.value = `The schematics aren't the same!\n\n${pollResponse.log}`;
                        await cleanupTask(taskId);
                        break;
                    case 'errored':
                        statusBox.current!.value = `An error occurred :(\n\n${pollResponse.reason}`;
                        await cleanupTask(taskId);
                        break;
                }
            }
        }, 1000);
        return () => clearInterval(timeout);
    }, [taskId]);

    const queueBroker = async () => {
        if (taskId) {
            return;
        }
        if (commandBox.current!.value.trim().length === 0) {
            statusBox.current!.value = `You must enter commands.`;
            return;
        }
        try {
            const queueResponse = await queueTask({
                golfId: golf.golf_id,
                initial: golf.hidden,
                input: golf.start_schematic,
                script: commandBox.current!.value,
                test: golf.test_schematic,
                token: 'cake'
            });
            if (queueResponse.taskId) {
                setTaskId(queueResponse.taskId);
            } else {
                statusBox.current!.value = `An error occurred`;
            }
        } catch (e) {
            statusBox.current!.value = `An error occurred :(\n\n${e}`;
        }
    };

    return (
        <Layout>
            <Head>
                <title>{golf.title} | WorldEdit Golf</title>
            </Head>
            <PageColumns>
                <MainContent>
                    <h1>{golf.title}</h1>
                    <h2>{golf.description}</h2>
                    <PreviewBox>
                        <p>Before</p> <p>After</p>
                    </PreviewBox>
                    <h3>Commands</h3>
                    <CommandBox ref={commandBox} />
                    <FancyButton onClick={queueBroker}>Run</FancyButton>
                    <h3>Output</h3>
                    <StatusBox disabled={true} ref={statusBox} />
                </MainContent>
                <SideLeaderboard>
                    {leaderboards.map(leaderboard => {
                        const date = new Date(leaderboard.date);
                        return (
                            <LeaderboardEntry
                                key={`${golf.golf_id}-${leaderboard.user_id}`}
                                strokes={leaderboard.score}
                                created={
                                    date
                                        .toLocaleTimeString()
                                        .replace(' AM', '')
                                        .replace(' PM', '') +
                                    ' ' +
                                    date.toDateString()
                                }
                                githubId={leaderboard.user_id}
                                name={leaderboard.user_id}
                                avatar={''}
                            />
                        );
                    })}
                </SideLeaderboard>
            </PageColumns>
        </Layout>
    );
}

Document.getInitialProps = async ({ query, res }: NextPageContext) => {
    const { golfId } = query;

    const golf = await getGolf(golfId as string);
    const leaderboards = await getLeaderboard(golfId as string);
    if (!golf) {
        if (res) {
            res.writeHead(302, {
                Location: '/'
            });
            res.end();
        } else {
            Router.push('/');
        }
    }
    return { golf, leaderboards };
};

export default Document;
