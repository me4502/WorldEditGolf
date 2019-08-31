import React from 'react';
import { Nav } from './Nav';
import { storiesOf } from '@storybook/react';

storiesOf('Nav', module)
    .add('Default', () => (<Nav>Hello World</Nav>));
