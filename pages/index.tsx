import React from 'react';
import Head from 'next/head';
import { Layout } from '../src/containers/Layout/Layout';
import { OpenChallenge } from '../src/pages/Home/OpenChallenges/OpenChallenges';
import { useIsLoggedIn } from '../src/components/Auth';
import Button from '../src/components/Input/Button';
import { getAllGolfs } from '../src/dynamoDb';
import router from 'next/router';
import styled from 'styled-components';

const isServerRendered = typeof window === 'undefined';

const ChallengeButton = styled(Button)`
    font-size: 22px;
    margin: auto;
    display: block;
`;

const Home = ({ golfs }) => {
    const isAuthenticated = useIsLoggedIn();

    const onCreateChallenge = () => {
        router.push('/submit');
    };

    return (
        <Layout isHome={true}>
            <Head>
                <title>WorldEdit Golf</title>
            </Head>
            {isAuthenticated && !isServerRendered && (
                <ChallengeButton onClick={onCreateChallenge}>
                    New Challenge
                </ChallengeButton>
            )}
            <OpenChallenge golfs={golfs} />
        </Layout>
    );
};

Home.getInitialProps = async () => {
    try {
        const golfs = await getAllGolfs();
        return { golfs };
    } catch (e) {
        return { error: e, golfs: [] };
    }
};

export default Home;
