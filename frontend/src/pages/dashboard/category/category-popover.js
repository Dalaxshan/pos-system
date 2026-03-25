import React from 'react';
import { Popover, Card, Stack, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { categoryApi } from 'src/api/category';
import { TYTextField } from 'src/components/ui/ty-textfield';
import * as Yup from 'yup';

const CategoryPopover = (props) => {
  const { anchorEl, handleClose, categoryMutate } = props;

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const reqBody = { name: values.name };
        await categoryApi.createCategory(reqBody);
        categoryMutate();
        toast.success('Category added!');
        formik.resetForm();
        handleClose();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ padding: 2, minWidth: 300 }}>
          <TYTextField
            fullWidth
            name="name"
            label="Category"
            formik={formik}
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Stack
              direction="row"
              spacing={1}
            >
              <LoadingButton
                type="button"
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={formik.isSubmitting}
              >
                Add Category
              </LoadingButton>
            </Stack>
          </Box>
        </Card>
      </form>
    </Popover>
  );
};

export default CategoryPopover;
