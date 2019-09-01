import {FunctionComponent} from "react";
import {styled} from "../../components/style/styled";
import * as React from "react";
import {Logo} from "../../components/Logo/Logo";
import {Title} from "../../components/Title/Title";
import {rem} from "../../components/style/rem";
import {Header} from "../../components/Header/Header";
import {Paragraph} from "../../components/Paragraph/Paragraph";
import {Padding} from "../../components/style/padding";
import Link from "../../../node_modules/next/link";

const StyledContainerBase = styled.div`
  width: 100%;
  align-items: center;
  padding: ${Padding()};
  border-bottom: solid ${props => props.theme.primaryLightColor} ${rem(2)};
`;

const StyledContainer = styled(StyledContainerBase)`
  display: flex;
  flex-direction: row;
  >:not(:last-child) {
    margin-right: 10px;
  }
`;

export const BrandHeader: FunctionComponent = () => (
    <div>
        <StyledContainer>
            <Logo />
            <Title><Link href="/"><a>WorldEdit Golf</a></Link></Title>
        </StyledContainer>
        <StyledContainerBase>
            <Header>Real WorldEdit ninjas count every command - do you?</Header>
            <Header>I know WorldEdit</Header>
            <Paragraph>Pick a challenge, write some commands, and show us what you got.</Paragraph>
        </StyledContainerBase>
    </div>
);
