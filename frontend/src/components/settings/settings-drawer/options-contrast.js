import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const options = [
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'High',
    value: 'high',
  },
];

export const OptionsContrast = (props) => {
  const { onChange, value } = props;

  return (
    <Stack spacing={1}>
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
        }}
      >
        Contrast
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

OptionsContrast.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['normal', 'high']),
};
