import React, { useEffect, useState } from 'react';
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
import { pollBroker, queueTask } from '../../src/broker';

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
    margin: 0 auto;
`;

const BaseTextStyle = styled.textarea`
    width: 100%;
    resize: none;
`;

const CommandBox = styled(BaseTextStyle)``;

const StatusBox = styled(BaseTextStyle)``;

function Document({ golf, leaderboards }: DocumentProps) {
    const [taskId, setTaskId] = useState(undefined);
    useEffect(() => {
        const timeout = setInterval(() => {
            if (taskId) {
                pollBroker(taskId);
            }
        }, 1000);
        return () => clearInterval(timeout);
    }, []);

    const queueBroker = async () => {
        if (taskId) {
            return;
        }
        try {
            const queueResponse = await queueTask({
                golfId: golf.golf_id,
                initial: golf.hidden,
                input: golf.start_schematic,
                script: '',
                test: golf.test_schematic,
                token: ''
            });
            if (queueResponse.taskId) {
                setTaskId(queueResponse.taskId);
            }
        } catch (e) {
            // TODO Show error dialog
            alert(e);
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
                    <CommandBox />
                    <FancyButton onClick={queueBroker}>Run</FancyButton>
                    <h3>Output</h3>
                    <StatusBox disabled={true} />
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
