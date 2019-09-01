import React from 'react';
import Head from 'next/head';
import { Layout } from '../src/containers/Layout/Layout';
import { OpenChallenge } from '../src/pages/Home/OpenChallenges/OpenChallenges';
import { useIsLoggedIn } from '../src/components/Auth';
import Button from '../src/components/Input/Button';
import router from 'next/router';

const isServerRendered = typeof window === 'undefined';

const Home = () => {
    const isAuthenticated = useIsLoggedIn();

    const onCreateChallenge = () => {
        router.push('/submit');
    };

    return (
        <Layout>
            <Head>
                <title>WorldEdit Golf</title>
            </Head>
            {isAuthenticated && !isServerRendered && (
                <Button onClick={onCreateChallenge}>New Challenge</Button>
            )}
            <OpenChallenge />
        </Layout>
    );
};

Home.getInitialProps = () => {
    return {};
};

export default Home;
