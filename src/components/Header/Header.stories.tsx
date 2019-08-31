import React from 'react';
import { Header } from './Header';
import { storiesOf } from '@storybook/react';

storiesOf('Header', module)
    .add('Default', () => (<Header>Hello World</Header>));
