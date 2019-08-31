import React from 'react';
import Head from 'next/head';
import {Layout} from "../src/containers/Layout/Layout";
import {OpenChallenge} from "../src/pages/Home/OpenChallenges/OpenChallenges";

const Home = () => (
    <Layout>
        <Head>
            <title>WorldEdit Golf</title>
        </Head>
        <OpenChallenge />
    </Layout>
);

Home.getInitialProps = () => {
    return {};
};

export default Home;
