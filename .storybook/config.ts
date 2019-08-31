import { configure } from '@storybook/react';

const src = require.context('../src', true, /\.stories\.tsx$/);

const loadStories = () => {
    src.keys().forEach(fileName => src(fileName));
};

configure(loadStories, module);
