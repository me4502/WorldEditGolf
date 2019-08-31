import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {Header} from "../src/components/Header/Header";
import {Layout} from "../src/containers/Layout/Layout";
import {Logo} from "../src/components/Logo/Logo";

const Home = () => (
    <Layout>
        <div>
            <Head>
                <title>Home</title>
            </Head>
            <div className='hero'>
                <Logo />
                <Header>Welcome to WorldEdit Golf</Header>
                <p className='description'>
                    To get started, edit <code>pages/index.js</code> and save to reload.
                </p>

                <div className='row'>
                    <Link href='https://github.com/zeit/next.js#setup'>
                        <a className='card'>
                            <h3>Getting Started &rarr;</h3>
                            <p>Learn more about Next.js on GitHub and in their examples.</p>
                        </a>
                    </Link>
                    <Link href='https://github.com/zeit/next.js/tree/master/examples'>
                        <a className='card'>
                            <h3>Examples &rarr;</h3>
                            <p>Find other example boilerplates on the Next.js GitHub.</p>
                        </a>
                    </Link>
                    <Link href='https://github.com/zeit/next.js'>
                        <a className='card'>
                            <h3>Create Next App &rarr;</h3>
                            <p>Was this tool helpful? Let us know how we can improve it!</p>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    </Layout>
);

Home.getInitialProps = () => {
    return {};
};

export default Home;
