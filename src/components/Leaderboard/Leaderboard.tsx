import React, { FunctionComponent } from "react";
import styled from "styled-components";

const Container = styled.ul`
  margin: 0;
  padding: 8px;

  li {
    list-style: none;
    margin: 0;
    margin-bottom: 8px;
  }
`;

const NameContainer = styled.h4`
  margin: 0;

  a,
  a:visited {
    color: inherit;
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 100ms;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const TimeContainer = styled.div``;

const InfoContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const StrokeCount = styled.div`
  font-size: 36px;
  font-weight: bold;
`;

const LeaderboardEntryImpl: FunctionComponent<{
  name: string;
  avatar: string;
  created: string;
  strokes: number;
  githubId: string;
}> = ({ name, created, avatar, strokes, githubId, ...props }) => (
  <li {...props}>
    <img src={avatar} />
    <InfoContainer>
      <NameContainer>
        {name} /{" "}
        <a target="__blank" href={`https://github.com/${githubId}`}>
          @{githubId}
        </a>
      </NameContainer>
      <TimeContainer>{created}</TimeContainer>
    </InfoContainer>
    <StrokeCount>{strokes}</StrokeCount>
  </li>
);

export const LeaderboardEntry = styled(LeaderboardEntryImpl)`
  background: rgba(77, 54, 114, 0.8);
  color: white;
  border: solid rgb(77, 54, 114);
  padding: 8px 14px;
  display: flex;

  img {
    width: 48px;
    height: 48px;
    margin-right: 14px;
  }
`;

export const Leaderboard: FunctionComponent = props => <Container {...props} />;
