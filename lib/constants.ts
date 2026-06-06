import type { Theme } from '@react-navigation/native';

const NAV_FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_600SemiBold',
  heavy: 'Inter_700Bold',
} as const;

export const NAV_THEME = {
  light: {
    background: 'hsl(300 30% 99%)', // background
    border: 'hsl(290 25% 89%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(12 88% 62%)', // accent
    primary: 'hsl(280 55% 38%)', // primary
    text: 'hsl(280 30% 12%)', // foreground
  },
  dark: {
    background: 'hsl(282 30% 7%)', // background
    border: 'hsl(282 20% 20%)', // border
    card: 'hsl(282 28% 11%)', // card
    notification: 'hsl(12 85% 65%)', // accent
    primary: 'hsl(285 70% 72%)', // primary
    text: 'hsl(300 25% 96%)', // foreground
  },
};

export const LIGHT_THEME: Theme = {
  dark: false,
  fonts: {
    regular: {
      fontFamily: NAV_FONTS.regular,
      fontWeight: '400',
    },
    medium: {
      fontFamily: NAV_FONTS.medium,
      fontWeight: '500',
    },
    bold: {
      fontFamily: NAV_FONTS.bold,
      fontWeight: '600',
    },
    heavy: {
      fontFamily: NAV_FONTS.heavy,
      fontWeight: '700',
    },
  },
  colors: NAV_THEME.light,
};
export const DARK_THEME: Theme = {
  dark: true,
  fonts: {
    regular: {
      fontFamily: NAV_FONTS.regular,
      fontWeight: '400',
    },
    medium: {
      fontFamily: NAV_FONTS.medium,
      fontWeight: '500',
    },
    bold: {
      fontFamily: NAV_FONTS.bold,
      fontWeight: '600',
    },
    heavy: {
      fontFamily: NAV_FONTS.heavy,
      fontWeight: '700',
    },
  },
  colors: NAV_THEME.dark,
};
