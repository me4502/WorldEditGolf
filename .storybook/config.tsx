import * as React from "react";
import { configure, addDecorator } from '@storybook/react';
import {ThemeProvider} from "styled-components";
import PrimaryTheme from "../src/components/style/theme";

const src = require.context('../src', true, /\.stories\.tsx$/);

const loadStories = () => {
    src.keys().forEach(fileName => src(fileName));
};

addDecorator((story) => (
    <ThemeProvider theme={PrimaryTheme}>
        {story()}
    </ThemeProvider>
));

configure(loadStories, module);
