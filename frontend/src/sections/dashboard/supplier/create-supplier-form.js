import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { supplierAPI } from 'src/api/supplier';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYMobileInput } from 'src/components/ui/ty-mobile-input';
import { useRouter } from 'next/router';
import { FileDropzone } from 'src/components/file-dropzone';
import { paths } from 'src/paths';
import { SvgIcon } from '@mui/material';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import Link from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { FormikProvider } from 'formik';

export const CreateSupplierForm = (props) => {
  const { formValues, isEditMode ,mutate} = props;
  const router = useRouter();

  const initialValues = {
    name: formValues?.name ?? '',
    email: formValues?.email ?? '',
    contactNumber: formValues?.contactNumber ?? '',
    companyName: formValues?.companyName ?? '',
    address: formValues?.address ?? '',
    supplierId: formValues?.supplierId ?? '',
    logo: formValues?.logoUrl ? [formValues?.logoUrl] : [],
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(80, 'Name must not exceed 80 characters')
      .required('Supplier Name is required'),

    email: Yup.string()
      .email('Invalid email format')
      .max(255, 'Email must not exceed 255 characters')
      .required('Email is required'),

    contactNumber: Yup.string()
      .test('valid', 'Invalid mobile number', function (val) {
        return isValidPhoneNumber(val) && isPossiblePhoneNumber(val);
      })
      .required('Local Number is required'),

    companyName: Yup.string()
      .min(3, 'Company Name must be at least 3 characters')
      .max(80, 'Company Name must not exceed 80 characters')
      .required('Company Name is required'),

    address: Yup.string()
      .max(255, 'Address must not exceed 255 characters')
      .required('Address is required'),

    supplierId: Yup.string().required('Supplier ID is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('contactNumber', values.contactNumber);
        formData.append('supplierId', values.supplierId);
        formData.append('companyName', values.companyName);
        formData.append('address', values.address);
        formData.append('logo', values.logo[0]);

        if (!isEditMode) {
          await supplierAPI.createSupplier(formData);
          toast.success('Supplier created successfully');
        } else {
          await supplierAPI.editSupplier(formValues._id, formData);
          mutate();
          toast.success('Supplier edited successfully');
        }
       
        router.push(paths.dashboard.supplier.index);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Link
            color="text.primary"
            href={paths.dashboard.supplier.index}
            underline="hover"
          >
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          </Link>
          <Typography variant="h5">
            {!isEditMode ? 'Create Supplier Details' : 'Edit Supplier Details'}
          </Typography>
        </Stack>

        <FileDropzone
          name="logo"
          caption="(JPG or PNG) Max Size 5MB"
          maxFiles={1}
        />

        <Grid2
          container
          spacing={2}
          sx={{ pt: 1 }}
        >
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TYTextField
              formik={formik}
              name="companyName"
              label="Company Name"
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TYTextField
              formik={formik}
              name="address"
              label="Company Address"
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TYMobileInput
              formik={formik}
              name="contactNumber"
              label="Contact Number"
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TYTextField
              formik={formik}
              name="email"
              label="Company Email"
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TYTextField
              formik={formik}
              name="name"
              label="Supplier Name"
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TYTextField
              formik={formik}
              name="supplierId"
              label="Supplier Id"
              required
            />
          </Grid2>
        </Grid2>

        <Stack
          direction="row"
          sx={{
            justifyContent: 'flex-end',
            mt: 3,
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={formik.isSubmitting}
            sx={{ width: '175px', height: '44px' }}
          >
            {isEditMode ? 'Edit Supplier' : 'Add Supplier'}
          </LoadingButton>
        </Stack>
      </form>
    </FormikProvider>
  );
};
