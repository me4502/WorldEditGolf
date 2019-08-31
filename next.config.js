
const prod = process.env.NODE_ENV === 'production';
const ASSETS_PREFIX = 'https://static.worldedit.golf';

module.exports = {
    target: 'serverless',
    assetsPrefix: ASSETS_PREFIX,
    env: {
        STATIC_PREFIX: prod ? ASSETS_PREFIX : '',
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        JWT_SECRET: process.env.JWT_SECRET
        // GA_TRACKING_ID: 'UA-139849956-4'
    }
};
