import { styled } from "../style/styled";
import { rem } from "../style/rem";
import { FunctionComponent } from "react";

const NavContainer = styled.nav`
  width: 100%;
  background-color: ${props => props.theme.brandColor};
  color: ${props => props.theme.primaryDarkColor};
  min-height: ${rem("50px")};
`;
const NavInner = styled.div`
  max-width: 1000px;
  display: flex;
  width: 100%;
  margin: auto;
  padding: 0 2rem;
`;

export const Nav: FunctionComponent = ({ children, ...rest }) => (
  <NavContainer {...rest}>
    <NavInner>{children}</NavInner>
  </NavContainer>
);
