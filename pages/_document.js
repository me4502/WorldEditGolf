import React from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';
import Helmet from 'react-helmet';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps, helmet: Helmet.renderStatic() };
    }

    render() {
        const { helmet } = this.props;

        return (
            <Html {...helmet.htmlAttributes.toComponent()}>
                <Head>
                    {helmet.meta.toComponent()}
                    {helmet.title.toComponent()}
                    {helmet.link.toComponent()}
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
                    />

                    <link
                        rel="shortcut icon"
                        href="/static/icons/icon-48x48.png"
                    />
                    <meta name="theme-color" content="#4B3570" />
                    <link
                        rel="apple-touch-icon"
                        sizes="48x48"
                        href="/static/icons/icon-48x48.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="72x72"
                        href="/static/icons/icon-72x72.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="96x96"
                        href="/static/icons/icon-96x96.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="144x144"
                        href="/static/icons/icon-144x144.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="192x192"
                        href="/static/icons/icon-192x192.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="256x256"
                        href="/static/icons/icon-256x256.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="384x384"
                        href="/static/icons/icon-384x384.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="512x512"
                        href="/static/icons/icon-512x512.png"
                    />

                    <link
                        href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=block"
                        rel="stylesheet"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_TRACKING_ID}');
          `
                        }}
                    />
                </Head>
                <body {...helmet.bodyAttributes.toComponent()}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
