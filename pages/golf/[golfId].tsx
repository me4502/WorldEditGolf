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
import { useElementWidth } from '../../src/components/Resize';
import { Schematic } from '../../src/components/Schematic';
import { useToken } from '../../src/components/Auth';
import { Button } from '../../src/components/Input/Button';

interface DocumentProps {
    golf: Golf;
    leaderboards: GolfLeaderboard[];
}

const PageColumns = styled.div`
    display: flex;
`;

const MainContent = styled.div`
    flex: 60%;
    overflow: hidden;
`;

const PreviewBox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-grow: 0;
`;

const SideLeaderboard = styled(Leaderboard)`
    flex: 35%;
    margin-left: 1rem;
`;

const BaseTextStyle = styled.textarea`
    width: 100%;
    resize: none;
    height: 200px;
    font-size: 1.3rem;
    line-height: 1.5;
`;

const PreviewArea = styled.div``;

const ResultPreview = styled(PreviewArea)`
    margin-top: 48px;
`;

function Document({ golf, leaderboards }: DocumentProps) {
    const [taskId, setTaskId] = useState(undefined);
    const [resultSchem, setResultSchem] = useState(undefined);
    const commandBox = useRef<HTMLTextAreaElement>(null);
    const statusBox = useRef<HTMLTextAreaElement>(null);
    const token = useToken();

    const cleanupTask = async (taskId: string) => {
        // Cleanup the broker
        await clearTask(taskId);
        setTaskId(undefined);
    };

    const contentRef = useRef<HTMLDivElement>();
    const width = useElementWidth(contentRef);

    console.error(width);

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
                        setResultSchem(pollResponse.result);
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
        if (!token) {
            statusBox.current!.value = `You must be signed in.`;
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
                token: token
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

    const smallSize = width / 2.05;

    return (
        <Layout>
            <Head>
                <title>{golf.title} | WorldEdit Golf</title>
            </Head>
            <PageColumns>
                <MainContent ref={contentRef}>
                    <h1>{golf.title}</h1>
                    <h2>{golf.description}</h2>
                    <PreviewBox>
                        <PreviewArea>
                            <Schematic
                                size={smallSize}
                                schematic={golf.start_schematic}
                            />
                            <p>Before</p>
                        </PreviewArea>
                        <PreviewArea>
                            <Schematic
                                size={smallSize}
                                schematic={golf.test_schematic}
                            />
                            <p>After</p>
                        </PreviewArea>
                    </PreviewBox>
                    <h3>Commands</h3>
                    <BaseTextStyle ref={commandBox} />
                    <Button onClick={queueBroker}>Run</Button>
                    <h3>Output</h3>
                    <BaseTextStyle disabled={true} ref={statusBox} />
                    {resultSchem && (
                        <ResultPreview>
                            <Schematic
                                size={Math.min(width, 500)}
                                schematic={resultSchem}
                            />
                            <p>Result</p>
                        </ResultPreview>
                    )}
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
