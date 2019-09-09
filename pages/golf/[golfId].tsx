import React, { useEffect, useState, useRef } from 'react';
import { NextPageContext } from 'next-server/dist/lib/utils';
import { Layout } from '../../src/containers/Layout/Layout';
import Head from 'next/head';
import { getGolf, getLeaderboard, getUser } from '../../src/dynamoDb';
import { Golf, GolfLeaderboard, User } from '../../src/types/database';
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
    userMap: { [key: string]: User };
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

interface SchematicBoxProps {
    schematic: string;
    size: number;
    title: string;
}

const SchematicBoxText = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

const SchematicBox: React.FC<SchematicBoxProps> = ({
    schematic,
    size,
    title
}) => {
    const onClickDownload = () => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;base64,' + schematic);
        element.setAttribute('download', `${title}.schem`);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);      
    };

    return (
        <div>
            <Schematic size={size} schematic={schematic} />
            <SchematicBoxText>
                <p>{title}</p>
                <Button onClick={onClickDownload}>Download</Button>
            </SchematicBoxText>
        </div>
    );
};

const ResultPreview = styled(SchematicBox)`
    margin-top: 48px;
`;

function Document({ golf, leaderboards, userMap }: DocumentProps) {
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
                initial: false,
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
                        <SchematicBox
                            schematic={golf.start_schematic}
                            size={smallSize}
                            title={'Before'}
                        />
                        <SchematicBox
                            schematic={golf.test_schematic}
                            size={smallSize}
                            title={'After'}
                        />
                    </PreviewBox>
                    <h3>Commands</h3>
                    <BaseTextStyle ref={commandBox} />
                    <Button onClick={queueBroker}>Run</Button>
                    <h3>Output</h3>
                    <BaseTextStyle disabled={true} ref={statusBox} />
                    {resultSchem && (
                        <ResultPreview
                            size={Math.min(width, 500)}
                            schematic={resultSchem}
                            title={'Result'}
                        />
                    )}
                </MainContent>
                <SideLeaderboard>
                    {leaderboards.map(leaderboard => {
                        const date = new Date(leaderboard.submitted_time);
                        const user = userMap[leaderboard.user_id];
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
                                githubId={
                                    user ? user.username : leaderboard.user_id
                                }
                                name={
                                    user ? user.fullname : leaderboard.user_id
                                }
                                avatar={user ? user.avatar : ''}
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
    let userMap = {};

    if (leaderboards) {
        const sortedLeaderboards = leaderboards.sort((a, b) => {
            return a.score - b.score || a.submitted_time - b.submitted_time;
        });
        const leaderUsers = sortedLeaderboards.map(lead => lead.user_id);
        const users = await Promise.all(leaderUsers.map(user => getUser(user)));
        userMap = users.reduce((a, b) => {
            a[b.user_id] = b;
            return a;
        }, {});
    }
    return { golf, leaderboards, userMap };
};

export default Document;
