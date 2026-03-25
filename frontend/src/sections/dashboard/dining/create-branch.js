import * as React from 'react';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import toast from 'react-hot-toast';
import { diningAPI } from 'src/api/dining';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYMobileInput } from 'src/components/ui/ty-mobile-input';
import { useRouter } from 'next/router';
import { SvgIcon } from '@mui/material';
import Link from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { paths } from 'src/paths';
import { mutate } from 'swr';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';

export const CreateBranchForm = (props) => {
  const { formValues, isEditMode, admins, isLoadingAdmins } = props;
  const router = useRouter();
  const initialValues = {
    branchName: formValues?.branchName ?? '',
    email: formValues?.email ?? '',
    contactNo: formValues?.contactNo ?? '',
    employeeId: { _id: formValues?.employeeId?._id ?? '', name: formValues?.employeeId?.name },
    address: formValues?.address ?? '',
  };

  const validationSchema = Yup.object({
    branchName: Yup.string().min(3).max(80).required('Branch Name is required'),
    email: Yup.string().email().max(255).required('Email is required'),
    contactNo: Yup.string().required('Contact Number is required'),
    address: Yup.string().max(255).required('Address is required'),
    employeeId: Yup.object().required('Manager ID is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const reqBody = {
          branchName: values.branchName,
          address: values.address,
          contactNo: values.contactNo,
          email: values.email,
          employeeId: values.employeeId._id,
        };

        if (!isEditMode) {
          await diningAPI.createBranch(reqBody);
          toast.success('Branch created successfully');
        } else {
          await diningAPI.editBranch(formValues._id, reqBody);
          toast.success('Branch edited successfully');
          mutate(['get-branch', formValues._id]);
        }
        router.push(paths.dashboard.dining.index);
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
            href={paths.dashboard.dining.index}
            underline="hover"
          >
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          </Link>

          <Typography variant="h4">
            {isEditMode ? 'Edit Branch Details' : 'Create Branch Details'}
          </Typography>
        </Stack>
        <Stack
          spacing={1}
          sx={{ pt: 1 }}
        >
          <TYTextField
            formik={formik}
            name="branchName"
            label="Branch Name"
            required
          />

          <TYTextField
            formik={formik}
            name="email"
            label="Email"
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
            name="address"
            label="Address"
            required
          />

          <TYAutocomplete
            formik={formik}
            label="Manager"
            name="employeeId"
            options={admins}
            isLoading={isLoadingAdmins}
            value={formik.values?.employeeId}
            getOptionLabel={(option) => option.name || ''}
            onChange={(event, newValue) => {
              formik.setFieldValue('employeeId._id', newValue?._id || '');
              formik.setFieldValue('employeeId.name', newValue?.name || '');
            }}
            required
          />

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
              {isEditMode ? 'Edit Branch' : 'Add Branch'}
            </LoadingButton>
          </Grid2>
        </Stack>
      </form>
    </FormikProvider>
  );
};
