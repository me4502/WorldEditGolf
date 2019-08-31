import App from 'next/app';
import Router from 'next/router';

import * as gtag from '../src/gtag';

Router.events.on('routeChangeComplete', url => gtag.pageview(url));

export default App;
