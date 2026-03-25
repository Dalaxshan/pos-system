import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { blue, green, brown, yellow, purple, maroon, dgreen, red, dpurple } from 'src/theme/colors';

export const OptionsColorPreset = (props) => {
  const { onChange, value } = props;

  const options = [
    {
      label: 'Maroon',
      value: 'maroon',
      color: maroon.main,
    },
    {
      label: 'Red',
      value: 'red',
      color: red.main,
    },
    {
      label: 'Orange',
      value: 'green',
      color: green.main,
    },
    {
      label: 'Yellow',
      value: 'yellow',
      color: yellow.main,
    },
    {
      label: 'Brown',
      value: 'brown',
      color: brown.main,
    },
    {
      label: 'Blue',
      value: 'blue',
      color: blue.main,
    },

    {
      label: 'Purple',
      value: 'dpurple',
      color: dpurple.main,
    },

    {
      label: 'Green',
      value: 'dgreen',
      color: dgreen.main,
    },

    {
      label: 'Black',
      value: 'purple',
      color: purple.main,
    },
  ];

  return (
    <Stack spacing={1}>
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
        }}
      >
        Primary Color
      </Typography>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {options.map((option) => (
          <Chip
            icon={
              <Box
                sx={{
                  backgroundColor: option.color,
                  borderRadius: '50%',
                  flexShrink: 0,
                  height: 24,
                  width: 24,
                }}
              />
            }
            key={option.value}
            label={option.label}
            onClick={() => onChange?.(option.value)}
            sx={{
              borderColor: 'transparent',
              borderRadius: 1.5,
              borderStyle: 'solid',
              borderWidth: 2,
              ...(option.value === value && {
                borderColor: 'primary.main',
              }),
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

OptionsColorPreset.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf([
    'blue',
    'green',
    'indigo',
    'purple',
    'yellow',
    'maroon',
    'dgreen',
    'red',
    'dpurple',
  ]),
};
