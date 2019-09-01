import { FunctionComponent } from 'react';
import { styled } from '../../components/style/styled';
import * as React from 'react';
import { Logo } from '../../components/Logo/Logo';
import { Title } from '../../components/Title/Title';
import { rem } from '../../components/style/rem';
import { Header } from '../../components/Header/Header';
import { Paragraph } from '../../components/Paragraph/Paragraph';
import { Padding } from '../../components/style/padding';
import Link from '../../../node_modules/next/link';

const StyledContainerBase = styled.div<{ isHome: boolean }>`
    width: 100%;
    align-items: center;
    padding: ${Padding()};
    margin: auto;

    ${({ isHome }) => isHome ? 'max-width: 800px' : 'max-width: 400px' };

    ${Header} {
        font-size: ${({ isHome }) => isHome ? '48px' : '24px' };
        text-align: center;
    }

    ${Paragraph} {
        font-size: ${({ isHome }) => isHome ? '32px' : '18px' };
        text-align: center;
    }
`;

const StyledContainer = styled(StyledContainerBase)`
    display: flex;
    margin-top: 32px;
    flex-direction: row;
    justify-content: center;
    > :not(:last-child) {
        margin-right: 10px;
    }
`;

const isHomePage = () => {
    if (typeof window === 'undefined') {
        return false;
    } else {
        return 
    }
}

export const BrandHeader: FunctionComponent<{ isHomePage?: boolean }> = ({ isHomePage = false }) => (
    <div>
        <StyledContainer isHome={isHomePage}>
            <Logo />
            <Title>
                <Link href="/">
                    <a>WorldEdit Golf</a>
                </Link>
            </Title>
        </StyledContainer>
        <StyledContainerBase isHome={isHomePage}>
            <Header>Real WorldEdit ninjas count every command - do you?</Header>
            <Paragraph>
                Pick a challenge, write some commands, and show us what you got.
            </Paragraph>
        </StyledContainerBase>
    </div>
);
