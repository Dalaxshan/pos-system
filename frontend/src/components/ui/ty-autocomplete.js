import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { getIn } from 'formik';

export const TYAutocomplete = (props) => {
  const {
    formik,
    name,
    label,
    onChange,
    renderOption,
    getOptionLabel,
    value,
    isLoading,
    freeSolo,
    ...rest
  } = props;
  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  const handleBlur = () => {
    formik.setFieldTouched(name, true);
  };

  return (
    <Autocomplete
      freeSolo={freeSolo}
      value={value}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      onChange={onChange}
      loading={isLoading}
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          sx={{
            '& .MuiOutlinedInput-root': {
              legend: {
                marginLeft: '30px',
              },
            },
            '& .MuiAutocomplete-inputRoot': {
              paddingLeft: '20px !important',
            },
            '& .MuiInputLabel-outlined': {
              paddingLeft: '20px',
            },
            '& .MuiInputLabel-shrink': {
              marginLeft: '20px',
              paddingLeft: '10px',
              paddingRight: 0,
              background: 'white',
            },
          }}
          onBlur={handleBlur}
          error={Boolean(fieldTouched && fieldError)}
          helperText={fieldTouched && fieldError}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      slotProps={{
        paper: {
          sx: {
            margin: 'auto',
          },
        },
      }}
    />
  );
};
