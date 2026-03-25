import { createTypography } from './create-typography';
import { createComponents } from './create-components';

// Here we do not modify the "palette" and "shadows" because "light" and "dark" mode
// may have different values.

export const createOptions = (config) => {
  const { direction = 'ltr' } = config;

  return {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    components: createComponents(),
    direction,
    shape: {
      borderRadius: 8,
    },
    typography: createTypography(),
    transitions: {
      easing: {
        sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      duration: {
        enteringScreen: 200,
        leavingScreen: 250,
      },
    },
    spacing: 8,
  };
};
