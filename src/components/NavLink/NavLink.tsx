import {styled} from "../style/styled";
import Link, {LinkProps} from "next/link";
import * as React from "react";
import {FunctionComponent} from "react";
import {rem} from "../style/rem";

export const StyledNavLink = styled.a`
    color: ${props => props.theme.primaryDarkColor};
    font-size: ${rem('18px')};
    line-height: ${rem('23px')};
    text-decoration: none;
    padding: ${rem('13.5px')} ${rem('15px')};
    display: inline-block;
`;

export const NavLink: FunctionComponent<Omit<LinkProps, 'passHref'>> = (props) => (
    <Link {...props} passHref={true}>
        <StyledNavLink>{props.children}</StyledNavLink>
    </Link>
);

export const NavLinkExternal = StyledNavLink;
