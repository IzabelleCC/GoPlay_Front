import { extendTheme } from 'native-base';

export const THEMES = extendTheme({
    colors: {
        gray: {
            50: '#F7F7F7',
            100: '#EAF0F3',
            200: '#D9D9D9',
            300: '#A3B1BA',
        },
        blue: {
            300: '#A8DADC',
            500: '#1267B0',
            800: '#093758',
        },
        yellow: {
            400: '#FADD2C',
        },
        white: '#fff',
        black: '#000',
    },
    fontConfig: {
        Montserrat: {
            400: {
                normal: 'Montserrat_400Regular',
            },
            700: {
                normal: 'Montserrat_700Bold',
            },
        },
    },
    fonts: {
        heading: 'Montserrat',
        body: 'Montserrat',
        mono: 'Montserrat',
    },
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
    },
});
