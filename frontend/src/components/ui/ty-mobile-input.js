import { TextField } from '@mui/material';
import { AsYouType } from 'libphonenumber-js';
import { getIn } from 'formik';

// TODO Fix Nested Field Error
export const TYMobileInput = (props) => {
  const { formik, name, label, ...rest } = props;

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={formik.values[name]}
      onChange={(e) => {
        if (e.target.value.length < 4) {
          e.target.value = '+94';
        }
        const newVal = new AsYouType('LK').input(e.target.value);
        formik.setFieldValue(name, newVal);
      }}
      onBlur={formik.handleBlur}
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
        },

        inputLabel: { sx: { paddingLeft: '1vh' } },
      }}
    />
  );
};
