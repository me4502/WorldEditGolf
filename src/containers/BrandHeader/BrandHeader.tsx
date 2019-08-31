import {FunctionComponent} from "react";
import {styled} from "../../components/style/styled";
import * as React from "react";
import {Logo} from "../../components/Logo/Logo";
import {Title} from "../../components/Title/Title";
import {rem} from "../../components/style/rem";
import {Header} from "../../components/Header/Header";
import {Paragraph} from "../../components/Paragraph/Paragraph";

const StyledContainerBase = styled.div`
  width: 100%;
  align-items: center;
  padding: ${rem(20)} 0;
`;

const StyledContainer = styled(StyledContainerBase)`
  border-bottom: solid ${props => props.theme.primaryLightColor} ${rem(2)};
  display: flex;
  flex-direction: row;
`;

export const BrandHeader: FunctionComponent = () => (
    <div>
        <StyledContainer>
            <Logo />
            <Title>WorldEdit Golf</Title>
        </StyledContainer>
        <StyledContainerBase>
            <Header>I know WorldEdit</Header>
            <Paragraph>Pick a challenge, fire up WorldEdit, and show us what you got.</Paragraph>
        </StyledContainerBase>
    </div>
);
