export type CSSVariableTypes =
    | 'fontFamily'
    | 'brandColor';
export type ThemeRecord = Readonly<Record<CSSVariableTypes, string>>;

export const PrimaryTheme: ThemeRecord = {
    fontFamily: `'Source Sans Pro', sans-serif`,
    brandColor: '#4d3672'
};
export default PrimaryTheme;
