import { alpha } from '@mui/system/colorManipulator';

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const neutral = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#161616', // Sidebar background color
  900: '#111927',
  1000: '#0370E3',
};

export const orange = {
  50: '#efdfda',
  100: '#f58e62',
  200: '#EB5829',
  300: '#ad3f1b',
  400: '#7d2e0f',
  main: '#f58e62',
};

export const blue = withAlphas({
  lightest: '#F5F8FF',
  light: '#EBEFFF',
  main: '#2970FF',
  dark: '#004EEB',
  darkest: '#00359E',
  contrastText: '#FFFFFF',
});

export const green = withAlphas({
  lightest: '#f4c5b2',
  light: '#fb8b5f',
  main: '#fb4c04',
  dark: '#be3c0c',
  darkest: '#973913',
  contrastText: '#FFFFFF',
});

export const brown = withAlphas({
  lightest: '#F5F5FF',
  light: '#EBEBFF',
  main: '#854D27',
  dark: '#5B2D0C',
  darkest: '#3D1A00',
  contrastText: '#FFFFFF',
});

export const purple = withAlphas({
  lightest: '#F9F5FF',
  light: '#F4EBFF',
  main: '#161616', // Dashboard theme color
  dark: '#161616', // Hover for + New Dashboard
  darkest: '#42307D',
  contrastText: '#FFFFFF',
});

export const maroon = withAlphas({
  lightest: '#FFEBEB',
  light: '#FFC7C7',
  main: '#790202',
  dark: '#4D0000',
  darkest: '#2E0000',
  contrastText: '#FFFFFF',
});

export const yellow = withAlphas({
  lightest: '#FFFAE6',
  light: '#FFC94A',
  main: '#fbba16',
  dark: '#C08B5C',
  darkest: '#C08B5C',
  contrastText: '#FFFFFF',
});

export const dgreen = withAlphas({
  lightest: '#F0FAF4',
  light: '#3FC79A',
  main: '#014A00',
  dark: '#013700',
  darkest: '#012600',
  contrastText: '#FFFFFF',
});

export const red = withAlphas({
  lightest: '#FFEBEB',
  light: '#FFC7C7',
  main: '#E31937',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF',
});

export const dpurple = withAlphas({
  lightest: '#F9F5FF',
  light: '#F4EBFF',
  main: '#5C115E',
  dark: '#3D0C3D',
  darkest: '#2A092E',
  contrastText: '#FFFFFF',
});

export const success = withAlphas({
  lightest: '#F0FDF9',
  light: '#3FC79A',
  main: '#10B981',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF',
});

export const info = withAlphas({
  lightest: '#ECFDFF',
  light: '#CFF9FE',
  main: '#06AED4',
  dark: '#0E7090',
  darkest: '#164C63',
  contrastText: '#FFFFFF',
});

export const warning = withAlphas({
  lightest: '#FFFAEB',
  light: '#FEF0C7',
  main: '#F79009',
  dark: '#B54708',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF',
});

export const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#F04438',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF',
});
