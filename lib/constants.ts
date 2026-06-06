import type { Theme } from '@react-navigation/native';

const NAV_FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_600SemiBold',
  heavy: 'Inter_700Bold',
} as const;

export const NAV_THEME = {
  light: {
    background: 'hsl(150 40% 99%)', // background
    border: 'hsl(152 30% 87%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(44 92% 52%)', // accent
    primary: 'hsl(162 72% 34%)', // primary
    text: 'hsl(168 45% 11%)', // foreground
  },
  dark: {
    background: 'hsl(168 38% 6%)', // background
    border: 'hsl(168 20% 19%)', // border
    card: 'hsl(168 32% 10%)', // card
    notification: 'hsl(44 90% 58%)', // accent
    primary: 'hsl(158 64% 52%)', // primary
    text: 'hsl(150 30% 96%)', // foreground
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
