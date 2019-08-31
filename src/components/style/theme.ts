export type CSSVariableTypes =
    | 'fontFamily'
    | 'primaryLightColor'
    | 'primaryDarkColor'
    | 'brandColor';
export type ThemeRecord = Readonly<Record<CSSVariableTypes, string>>;

export const PrimaryTheme: ThemeRecord = {
    fontFamily: `'Open Sans Pro', sans-serif`,
    brandColor: '#4d3672',
    primaryDarkColor: '#ffffff',
    primaryLightColor: '#333333'
};
export default PrimaryTheme;
