import * as React from 'react';
import { FunctionComponent } from 'react';
import { Header } from '../../../components/Header/Header';
import styled from 'styled-components';
import { Schematic } from '../../../components/Schematic';
import { NavLink } from '../../../components/NavLink/NavLink';

const Entries = styled.div`
    > div:not(:last) {
        border-bottom: 2px red;
    }
`;

export interface ChallengeEntryProps {
    schematic: string;
    title: string;
    description: string;
    author: string;
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
    author,
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
                <h4>{author}</h4>
                <p>{description}</p>
            </InfoContainer>
        </ChallengeEntryContainer>
    );
};

export const OpenChallenge: FunctionComponent = ({ children }) => (
    <>
        <Header>Open WorldEdit Challenges</Header>
        <Entries>
            <ChallengeEntry
                title={'A great test to try!'}
                author={'Bennett Hardwick'}
                description={
                    'Does anything think they can defeat this amazing golf that I created? Good luck!'
                }
                golfId={'wow'}
                schematic={
                    'H4sIAAAAAAAAAF2O3UrDQBCFj1lskrXFd/AxBL0QC15YLFSsP4iM6SQZTDeQHdDe9kV9FJ2tQsVzc5gzw3fGo1xULa9JpXLwc+pYlWf0AcB55L+Bw/FaAlcD1XoatQ9s+wOHyT4lGSzLHE72WTNQjC+vXV+9PcXQv2/OauoiPyPJIb/jIUofEivD6JpDoy0yj2LGSitSciiX05u6jqz3X6Y/88O/+XEHNcwVS9MqshzlRWq+NI5tCuxqTDhcyioVlRjfSsfToKLC0aeLI4x+eOlDa/g0Pzff4hs2pFkvKwEAAA=='
                }
            />
            <ChallengeEntry
                title={'A great test to try!'}
                golfId={'test'}
                author={'Bennett Hardwick'}
                description={
                    'Does anything think they can defeat this amazing golf that I created? Good luck!'
                }
                schematic={
                    'H4sIAAAAAAAAAF2O3UrDQBCFj1lskrXFd/AxBL0QC15YLFSsP4iM6SQZTDeQHdDe9kV9FJ2tQsVzc5gzw3fGo1xULa9JpXLwc+pYlWf0AcB55L+Bw/FaAlcD1XoatQ9s+wOHyT4lGSzLHE72WTNQjC+vXV+9PcXQv2/OauoiPyPJIb/jIUofEivD6JpDoy0yj2LGSitSciiX05u6jqz3X6Y/88O/+XEHNcwVS9MqshzlRWq+NI5tCuxqTDhcyioVlRjfSsfToKLC0aeLI4x+eOlDa/g0Pzff4hs2pFkvKwEAAA=='
                }
            />
            {children}
        </Entries>
    </>
);
