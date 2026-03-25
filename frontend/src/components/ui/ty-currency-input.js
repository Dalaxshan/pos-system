import React from 'react';
import { NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';
import { getIn } from 'formik';

export const TYCurrencyInput = (props) => {
  const { formik, name, label, ...rest } = props;

  const fieldValue = getIn(formik.values, name);
  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <NumericFormat
      fullWidth
      label={label}
      name={name}
      onBlur={formik.handleBlur}
      InputProps={{
        sx: {
          '& input': {
            pt: '1',
            pl: '1',
          },
        },
      }}
      InputLabelProps={{ sx: { paddingLeft: '1vh' } }}
      onValueChange={({ floatValue }) => {
        formik.setFieldValue(name, floatValue);
      }}
      value={fieldValue}
      prefix=""
      customInput={TextField}
      fixedDecimalScale
      thousandSeparator=","
      error={Boolean(fieldTouched && fieldError)}
      helperText={fieldTouched && fieldError}
      {...rest}
    />
  );
};
