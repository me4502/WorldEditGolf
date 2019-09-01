import * as React from 'react';
import { Nav } from '../../components/Nav/Nav';
import { NavLinkExternal, NavLink } from '../../components/NavLink/NavLink';
import styled from 'styled-components';

const isServerRendered = typeof window === 'undefined';

const Separator = styled.div`
    flex-grow: 1;
`;

export const NavEngineHub: React.FunctionComponent<{
    isAuthenticated: boolean;
    onLogOut: () => void;
}> = ({ isAuthenticated, onLogOut }) => (
    <Nav>
        <NavLinkExternal target="_blank" href="https://enginehub.org/">
            EngineHub.org
        </NavLinkExternal>
        <NavLink href="/">
            Home
        </NavLink>
        <Separator />
        {!isAuthenticated && (
            <NavLinkExternal
                key="login"
                href={`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`}
            >
                Log in
            </NavLinkExternal>
        )}
        {isAuthenticated && !isServerRendered && (
            <NavLinkExternal key="logout" onClick={onLogOut}>
                Log out
            </NavLinkExternal>
        )}
    </Nav>
);
