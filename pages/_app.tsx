import App from 'next/app';
import Router from 'next/router';

import * as gtag from '../src/gtag';
import {ThemeProvider} from "styled-components";
import {PrimaryTheme} from "../src/components/style/theme";
import * as React from "react";
import {GlobalStyle} from "../src/components/style/styled";

Router.events.on('routeChangeComplete', url => gtag.pageview(url));

export default class MyApp extends App {
    render () {
        const { Component, pageProps } = this.props;
        return (
            <>
                <GlobalStyle />
                <ThemeProvider theme={PrimaryTheme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </>
        )
    }
}
