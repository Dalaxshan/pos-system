import * as React from 'react';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import toast from 'react-hot-toast';
import { employeeApi } from 'src/api/employee';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYMobileInput } from 'src/components/ui/ty-mobile-input';
import { useRouter } from 'next/router';
import { FileDropzone } from 'src/components/file-dropzone';
import { paths } from 'src/paths';
import { MenuItem, SvgIcon } from '@mui/material';
import Link from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';

export const CreateEmployeeForm = (props) => {
  const { formValues, isEditMode ,mutate} = props;
  const router = useRouter();

  const initialValues = {
    name: formValues?.name ?? '',
    email: formValues?.email ?? '',
    contactNo: formValues?.contactNo ?? '',
    role: formValues?.role ?? '',
    address: formValues?.address ?? '',
    nic: formValues?.nic ?? '',
    password: '',
    profilePhoto: formValues?.profilePhoto ? [formValues?.profilePhoto] : [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3).max(80).required('Employee Name is required'),
    email: Yup.string().email().max(255).required('Email is required'),
    contactNo: Yup.string().required('Contact Number is required'),

    address: Yup.string().max(255).required('Address is required'),
    nic: Yup.string().optional(),
    password: Yup.string()
      .min(8, 'Password is too short - should be 8 characters minimum.')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .max(255, 'Password is too long - should be 255 characters maximum.')
      .when('isEditMode', {
        is: false,
        then: (schema) => schema.required('Password is required'),
      }),
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
        formData.append('nic', values.nic);
        formData.append('role', values.role);
        if (values.profilePhoto.length > 0) {
          formData.append('profilePhoto', values.profilePhoto[0]);
        }
        if (!isEditMode) {
          formData.append('password', values.password);
          await employeeApi.createEmployee(formData);
          toast.success('Employee created successfully');
        } else {
          await employeeApi.editEmployee(formValues._id, formData);
          mutate();
          toast.success('Employee edited successfully');
        }
       
        router.push(paths.dashboard.employee.index);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'An error occurred');
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ pb: 2 }}
        >
          <Link
            color="text.primary"
            href={paths.dashboard.employee.index}
            underline="hover"
          >
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          </Link>

          <Typography variant="h4">
            {!isEditMode ? 'Create Employee' : 'Edit Employee Details'}
          </Typography>
        </Stack>
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
            label="Full Name"
            required
          />
          <Stack
            direction={'row'}
            spacing={2}
          >
            <TYTextField
              formik={formik}
              name="email"
              label="Personal Email"
              required
            />
            <TYMobileInput
              formik={formik}
              name="contactNo"
              label="Contact Number"
              required
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
          >
            <TYTextField
              formik={formik}
              name="role"
              label="Role"
              required
              select
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
              <MenuItem value="chef">Chef</MenuItem>
            </TYTextField>
            <TYTextField
              formik={formik}
              name="nic"
              label="NIC"
            />
          </Stack>
          <TYTextField
            formik={formik}
            name="address"
            label="Address"
            required
          />
          {!isEditMode && (
            <TYTextField
              formik={formik}
              name="password"
              label="Password"
              type="password"
              required
            />
          )}

          <Grid2
            container
            sx={{
              justifyContent: 'flex-end',
              marginTop: 2,
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={formik.isSubmitting}
              sx={{ width: '175px', height: '44px' }}
            >
              {isEditMode ? 'Edit Employee' : 'Add Employee'}
            </LoadingButton>
          </Grid2>
        </Stack>
      </form>
    </FormikProvider>
  );
};
