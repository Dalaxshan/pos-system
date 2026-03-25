import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { paths } from 'src/paths';
import { NumericFormat } from 'react-number-format';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { invoicesApi } from 'src/api/invoices';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';

const initialValues = {
  member: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
  },
  description: '',
  totalAmount: '',
  invoiceNumber: 'IYV-8745',
  issueDate: Date.now(),
  dueDate: Date.now(),
  status: 'paid',
};

const validationSchema = Yup.object({
  member: Yup.object(),
  description: Yup.string().max(255).required(),
  totalAmount: Yup.string().max(255).required(),
  invoiceNumber: Yup.string().max(255).required(),
  issueDate: Yup.string().max(255).required(),
  dueDate: Yup.string().max(255).required(),
});

export const CreateInvoiceForm = (props) => {
  const { memberList, isLoadingMembers } = props;
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await invoicesApi.createInvoice({
          memberId: values.member._id,
          customerName: `${values.member.firstName} ${values.member.lastName}`,
          customerEmail: values.member.email,
          customerMobile: values.member.contactNumber,
          customerAddress: values.member.address,
          issueDate: values.issueDate,
          dueDate: values.dueDate,
          description: values.description,
          totalAmount: values.totalAmount,
          status: values.status,
        });
        toast.success('Invoice created');
        router.push(paths.dashboard.invoices.index);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Grid2
              container
              spacing={1}
            >
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Customer details</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={1}>
                  <TYAutocomplete
                    formik={formik}
                    freeSolo
                    name="member"
                    label="Find Member"
                    options={memberList}
                    loading={isLoadingMembers}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    onChange={(event, newInputValue) => {
                      formik.setFieldValue('member', newInputValue ?? initialValues.member);
                    }}
                  />
                  <TextField
                    error={
                      !!(
                        formik.touched.member?.contactNumber && formik.errors.member?.contactNumber
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.member?.contactNumber && formik.errors.member?.contactNumber
                    }
                    label="Customer Mobile"
                    name="member.contactNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values?.member?.contactNumber}
                  />
                  <TextField
                    error={!!(formik.touched.member?.address && formik.errors.member?.address)}
                    fullWidth
                    helperText={formik.touched.member?.address && formik.errors.member?.address}
                    label="Customer Address"
                    multiline
                    rows={3}
                    name="member.address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.member?.address}
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid2
              container
              spacing={3}
            >
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Product Pricing</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                  <TextField
                    error={!!(formik.touched.description && formik.errors.description)}
                    fullWidth
                    helperText={formik.touched.description && formik.errors.description}
                    label="Product Description"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                  <NumericFormat
                    error={!!(formik.touched.totalAmount && formik.errors.totalAmount)}
                    fullWidth
                    label="Total Price"
                    name="totalAmount"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.totalAmount}
                    prefix="LKR "
                    customInput={TextField}
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator=","
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid2
              container
              spacing={3}
            >
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Other Details</Typography>
              </Grid2>
              <Grid2
                xs={12}
                md={8}
              >
                <Stack spacing={1}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    label="Issue Date"
                    name="issueDate"
                    onBlur={formik.handleBlur}
                    onChange={(date) => formik.setFieldValue('issueDate', date)}
                    value={formik.values.issueDate}
                  />
                  <DatePicker
                    format="dd/MM/yyyy"
                    label="Due Date"
                    name="dueDate"
                    onBlur={formik.handleBlur}
                    onChange={(date) => formik.setFieldValue('dueDate', date)}
                    value={formik.values.dueDate}
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button color="inherit">Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={formik.isSubmitting}
          >
            Create
          </LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
};
