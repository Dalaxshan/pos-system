import { TextField } from '@mui/material';
import { getIn } from 'formik';

export const TYTextField = (props) => {
  const { formik, name, label, autoComplete, ...rest } = props;
  const fieldValue = getIn(formik.values, name);
  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      autoComplete={autoComplete}
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
              paddingLeft: '2vh',
            },
          },
        },

        inputLabel: { sx: { paddingLeft: '1vh' } },
      }}
    />
  );
};
