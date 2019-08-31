import * as React from "react";
import {Nav} from '../../components/Nav/Nav';
import {NavLinkExternal} from "../../components/NavLink/NavLink";

export const NavEngineHub = () =>
    (
        <Nav>
            <NavLinkExternal target='_blank' href='https://enginehub.org/'>EngineHub.org</NavLinkExternal>
        </Nav>
    );
