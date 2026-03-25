import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const options = [
  {
    label: 'Blend-in',
    value: 'blend-in',
  },
  {
    label: 'Discrete',
    value: 'discrete',
  },
  {
    label: 'Evident',
    value: 'evident',
  },
];

export const OptionsNavColor = (props) => {
  const { onChange, value } = props;

  return (
    <Stack spacing={1}>
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
        }}
      >
        Nav Color
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
            key={option.label}
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

OptionsNavColor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
};
