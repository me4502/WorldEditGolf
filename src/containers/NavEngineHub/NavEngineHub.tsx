import * as React from 'react';
import { Nav } from '../../components/Nav/Nav';
import { NavLinkExternal } from '../../components/NavLink/NavLink';

export const NavEngineHub: React.FunctionComponent<{
  isAuthenticated: boolean;
}> = ({ isAuthenticated }) => (
  <Nav>
    <NavLinkExternal target='_blank' href='https://enginehub.org/'>
      EngineHub.org
    </NavLinkExternal>
    {!isAuthenticated && (
      <NavLinkExternal
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`}
      >
        Log in
      </NavLinkExternal>
    )}
  </Nav>
);
