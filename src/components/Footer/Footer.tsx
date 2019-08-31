import {styled} from "../style/styled";
import {rem} from "../style/rem";

export const Footer = styled.footer`
  border-top: solid ${props => props.theme.primaryLightColor} ${rem(2)};
  padding: 0 ${rem(152)};
`;
