import * as React from 'react';
import {styled} from "../style/styled";
import {FunctionComponent} from "react";
import {SpinnyBoy} from "../../animations/SpinnyBoy";

const ImageContainer = styled.div`
  position: relative;
  z-index: 0;
  display: inline-block;
`;

const InnerImage = styled.img`
  position: absolute;
  z-index: 1;
  height: 40%;
  width: 40%;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  transform: scale(1.1);
  animation: 300ms ${SpinnyBoy} linear infinite;
`;

export const Logo: FunctionComponent = () => (
  <ImageContainer>
    <img src="/static/WorldEdit.png" alt="World Edit Logo" />
    <InnerImage src="/static/GolfBall.jpg" alt="Golf Ball" />
  </ImageContainer>
);

