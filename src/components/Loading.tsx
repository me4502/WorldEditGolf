import React from 'react';
import styled from 'styled-components';
import {SpinnyBoy} from "../animations/SpinnyBoy";

const Image = styled.img`
    max-width: 100px;
    width: 80vw;
    height: 80vw;
    animation: ${SpinnyBoy} 800ms cubic-bezier(.3,0,.38,.99) infinite;
    border-radius: 50%;
    max-height: 100px;
`;

export const Loading = () => <Image src="/static/GolfBall.jpg" />;
