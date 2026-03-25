import React, { useState } from 'react';
import { TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { getIn } from 'formik';

export const TYPasswordInput = (props) => {
  const { formik, name, label, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const fieldValue = getIn(formik.values, name);
  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      fullWidth
      label={label}
      name={name}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      value={fieldValue}
      error={Boolean(fieldTouched && fieldError)}
      helperText={fieldTouched && fieldError}
      {...rest}
      slotProps={{
        input: {
          sx: {
            '& input': {
              pt: '1',
              pl: '1',
            },
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        },

        inputLabel: { sx: { paddingLeft: '1vh' } },
      }}
    />
  );
};
