import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Image from 'next/image';
import { getIn } from 'formik';

export const countries = [{ code: 'LK', label: 'Sri Lanka', phone: '94' }];

export const TYCountrySelect = ({ formik, name, label, ...rest }) => {
  const defaultCountry = countries[0];
  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  const handleBlur = () => {
    formik.setFieldTouched(name, true);
  };

  return (
    <Autocomplete
      id="country-select-demo"
      options={countries}
      fullWidth
      autoHighlight
      getOptionLabel={(option) => option.label}
      defaultValue={defaultCountry}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={option.code}
            {...otherProps}
          >
            <Image
              loading="lazy"
              width={33}
              height={25}
              srcSet={`https://flagcdn.com/w80/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
              alt="Country Flag"
              style={{ flexShrink: 0, paddingRight: 5, width: 'auto', height: 'auto' }}
            />
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          onBlur={handleBlur}
          error={Boolean(fieldTouched && fieldError)}
          helperText={fieldTouched && fieldError}
          label={label || 'Choose a country'}
          autoComplete="off"
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
          slotProps={{
            htmlInput: {
              ...params.inputProps,
            },
          }}
        />
      )}
      onChange={(event, newInputValue) => {
        formik.setFieldValue(name, newInputValue ? newInputValue.label : '');
      }}
      {...rest}
      slotProps={{
        paper: {
          sx: {
            width: 350,
            margin: 'auto',
          },
        },
      }}
    />
  );
};
