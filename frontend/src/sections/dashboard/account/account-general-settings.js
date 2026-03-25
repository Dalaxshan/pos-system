import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYMobileInput } from 'src/components/ui/ty-mobile-input';
import { FileDropzone } from 'src/components/file-dropzone';
import { Card, CardContent, Divider, TextField } from '@mui/material';
import { accountAPI } from 'src/api/account';

export const AccountGeneralSettings = (props) => {
  const { formValues, mutate } = props;

  const initialValues = {
    profilePhoto: formValues?.profilePhoto ? [formValues.profilePhoto] : [],
    name: formValues?.name ?? '',
    email: formValues?.email ?? '',
    contactNo: formValues?.contactNo ?? '',
    role: formValues?.role ?? '',
    address: formValues?.address ?? '',
    employeeId: formValues?.employeeId ?? '',
  };
  const validationSchema = Yup.object({
    name: Yup.string().min(3).max(80).required('Name is required'),
    email: Yup.string().email().max(255).required('Email is required'),
    contactNo: Yup.string().required('Contact Number is required'),
    address: Yup.string().max(255).required('Address is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('contactNo', values.contactNo);
        formData.append('address', values.address);
        formData.append('role', values.role);
        if (values.profilePhoto.length > 0) {
          formData.append('profilePhoto', values.profilePhoto[0]);
        }
        await accountAPI.editUser(formValues._id, formData);
        mutate();
        toast.success('Account updated successfully');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Account</Typography>
      <Divider />
      <Card>
        <CardContent>
          <Grid2
            container
            spacing={3}
          >
            <Grid2 size={12}>
              <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack
                    spacing={1}
                    sx={{ pt: 1 }}
                  >
                    <FileDropzone
                      name="profilePhoto"
                      caption="(JPG or PNG) Max Size 5MB"
                      maxFiles={1}
                    />

                    <TYTextField
                      formik={formik}
                      name="name"
                      label="Name"
                      required
                    />
                    <TYTextField
                      formik={formik}
                      name="address"
                      label="Address"
                      required
                    />
                    <TYMobileInput
                      formik={formik}
                      name="contactNo"
                      label="Contact Number"
                      required
                    />
                    <TYTextField
                      formik={formik}
                      name="email"
                      label="Personal email"
                      required
                    />

                    <TextField
                      label="Employee ID"
                      value={formik.values?.employeeId}
                      readOnly={true}
                    />

                    <Grid2
                      container
                      spacing={2}
                      sx={{
                        justifyContent: 'flex-end',
                      }}
                    >
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={formik.isSubmitting}
                      >
                        Save Changes
                      </LoadingButton>
                    </Grid2>
                  </Stack>
                </form>
              </FormikProvider>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Stack>
  );
};
