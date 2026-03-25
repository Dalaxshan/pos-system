import { PatternFormat } from 'react-number-format';
import { TextField } from '@mui/material';
import { getIn } from 'formik';

export const TYPostalCodeInput = (props) => {
  const { formik, name, label, ...rest } = props;
  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <PatternFormat
      customInput={TextField}
      fullWidth
      label={label}
      name={name}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      value={formik.values[name]}
      error={Boolean(fieldTouched && fieldError)}
      helperText={fieldTouched && fieldError}
      format={'#####'}
      InputProps={{
        sx: {
          '& input': {
            pt: '1',
            pl: '1',
          },
        },
      }}
      InputLabelProps={{ sx: { paddingLeft: '1vh' } }}
      {...rest}
    />
  );
};
