import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { diningAPI } from 'src/api/dining';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { Card, SvgIcon } from '@mui/material';
import Link from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { paths } from 'src/paths';

export const CreateTableForm = (props) => {
  const { branchId, mutate, isEditMode, formValues } = props;

  const initialValues = {
    tableName: formValues?.tableName ?? '',
    chairs: formValues?.chairs ?? 0,
  };

  const validationSchema = Yup.object({
    tableName: Yup.string().min(3).max(80).required('Table Name is required'),
    chairs: Yup.number().min(1, 'There must be at least 1 chair').required('Chair is required!'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const reqBody = {
          tableName: values.tableName,
          chairs: values.chairs,
          branchId: branchId,
          tableStatus: 'Available',
        };

        if (!isEditMode) {
          await diningAPI.createTable(reqBody);
          toast.success('Table created successfully');
          formik.resetForm();
        } else {
          await diningAPI.editBranch(formValues._id, reqBody);

          toast.success('Table edited successfully');
        }
        mutate();
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'An error occurred');
      }
    },
  });

  return (
    <Card sx={{ p: 2,mt:4 }}>
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

          <Typography variant="h6">
            {isEditMode ? 'Edit Table Details' : ' Add New Table'}
          </Typography>
        </Stack>
        <Stack
          spacing={1}
          sx={{ pt: 1 }}
        >
          <TYTextField
            formik={formik}
            name="tableName"
            label="Table Name"
            required
          />
          <TYCurrencyInput
            formik={formik}
            name="chairs"
            label="No of chairs"
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
              fullWidth
            >
              {isEditMode ? 'Edit Table' : 'Add Table'}
            </LoadingButton>
          </Grid2>
        </Stack>
      </form>
    </Card>
  );
};
