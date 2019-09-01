import * as React from 'react';
import { FunctionComponent } from 'react';
import { Header } from '../../../components/Header/Header';
import styled from 'styled-components';
import { Schematic } from '../../../components/Schematic';
import { NavLink } from '../../../components/NavLink/NavLink';
import { Golf } from '../../../types/database';

const Entries = styled.div`
    > div:not(:last) {
        border-bottom: 2px red;
    }
`;

export interface ChallengeEntryProps {
    schematic: string;
    title: string;
    description: string;
    golfId: string;
}

const DEFAULT_SIZE = 140;

const ChallengeEntryContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 12px 0;
    padding: 8px 0;

    canvas {
        width: ${DEFAULT_SIZE}px;
        height: ${DEFAULT_SIZE}px;
    }
`;

const InfoContainer = styled.div`
    flex-grow: 1;
    margin-left: 22px;

    h3 {
        font-size: 28px;
        margin: 0;
        font-weight: normal;
    }

    h4 {
        font-size: 18px;
        margin: 0;
    }
`;

const Link = styled(NavLink)`
    color: inherit;
    padding: 8px 0px;
`;

export const ChallengeEntry: FunctionComponent<ChallengeEntryProps> = ({
    schematic,
    title,
    description,
    golfId,
    ...rest
}) => {
    return (
        <ChallengeEntryContainer {...rest}>
            <Schematic schematic={schematic} size={DEFAULT_SIZE} />
            <InfoContainer>
                <Link href={`/golf/${golfId}`}>
                    <h3>{title}</h3>
                </Link>
                <p>{description}</p>
            </InfoContainer>
        </ChallengeEntryContainer>
    );
};

const ChallengeTitle = styled.h2`
    font-size: 24px;
`;

export const OpenChallenge: FunctionComponent<{ golfs: Golf[] }> = ({
    children,
    golfs
}) => (
    <>
        <ChallengeTitle>Open Challenges</ChallengeTitle>
        <Entries>
            {golfs.map((golf, i) => (
                <ChallengeEntry
                    schematic={golf.test_schematic}
                    description={golf.description}
                    golfId={golf.golf_id}
                    title={golf.title}
                    key={i}
                />
            ))}
            {children}
        </Entries>
    </>
);
