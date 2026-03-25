import { blue, green, brown, purple, yellow, maroon, dgreen, red, dpurple } from './colors';

export const getPrimary = (preset) => {
  switch (preset) {
    case 'blue':
      return blue;
    case 'green':
      return green;
    case 'brown':
      return brown;
    case 'purple':
      return purple;
    case 'yellow':
      return yellow;
    case 'maroon':
      return maroon;
    case 'dgreen':
      return dgreen;
    case 'red':
      return red;
    case 'dpurple':
      return dpurple;
    default:
      console.error(
        'Invalid color preset, accepted values: "blue", "green", "brown" ,"purple"" , "yellow" ,"maroon", "dark green", "red" or "dark purple".'
      );
      return blue;
  }
};
