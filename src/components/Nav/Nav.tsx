import {styled} from "../style/styled";
import {rem} from "../style/rem";

export const Nav = styled.nav`
   background-color: ${props => props.theme.brandColor};
   color: ${props => props.theme.primaryDarkColor};
   min-height: ${rem('50px')};
   margin: 0;
   border: 0;
   border-radius: 0;
`;
