import React from 'react';
import Head from 'next/head';
import {Layout} from "../src/containers/Layout/Layout";

const Home = () => (
    <Layout>
        <Head>
            <title>WorldEdit Golf</title>
        </Head>
    </Layout>
);

Home.getInitialProps = () => {
    return {};
};

export default Home;
