import baseStyled, { createGlobalStyle, ThemedStyledInterface } from 'styled-components';
import PrimaryTheme from './theme';

export type Theme = typeof PrimaryTheme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

  body {
    font-family: ${PrimaryTheme.fontFamily};
    margin: 0;
  }
  
  * {
    box-sizing: border-box;
  }
  
  html {
    -webkit-text-size-adjust: 100%;
  }
`;
