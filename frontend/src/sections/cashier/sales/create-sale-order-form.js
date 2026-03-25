import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import {
  TextField,
  Box,
  Card,
  IconButton,
  Button,
  SvgIcon,
  Typography,
  Tooltip,
  Divider,
} from '@mui/material';
import { salesOrderApi } from 'src/api/sales';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { paymentStatus } from 'src/utils/payment-status';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { RemoveCircle } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Link from 'next/link';
import { paths } from 'src/paths';
import { useState } from 'react';

export const CreateSaleOrderForm = (props) => {
  const { salesItems, customerList } = props;
  const [setOpen, handleOpen] = useState(false);
  const user = useSelector((state) => state?.auth?.user);

  const initialValues = {
    employee: '',
    customer: '',
    name: '',
    contactNo: '',
    email: '',
    items: [{ itemId: '', quantity: 0, unitPrice: 0, discount: 0 }],
    paymentStatus: 'unpaid',
    discount: 0,
  };

  const validationSchema = Yup.object({
    // employee: Yup.object().required('Employee is required!'),
    customer: Yup.object().required('Customer is required'),
    items: Yup.array().of(
      Yup.object().shape({
        menu: Yup.object().required('Item is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .integer('Quantity must be an integer'),
        unitPrice: Yup.number().min(0).required('Unit Price is required'),
      })
    ),
    paymentStatus: Yup.string().required('Payment status is required'),
    discount: Yup.number().optional().min(0, 'Discount cannot be negative').max(100, 'Discount cannot be more than 100%'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const reqBody = {
          employeeId: user.id,
          customerId: values.customer._id,
          items: values.items.map((item) => ({
            itemId: item.menu._id,
            quantity: item.quantity,
          })),
          discount: values.discount,
          paymentStatus: values.paymentStatus,
        };
        await salesOrderApi.createSaleOrder(reqBody);
        formik.resetForm();
        toast.success('Customer order created successfully');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <FormikProvider value={formik}>
        <Card sx={{ p: 4, ml: 12, mr: 12 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Link
              color="text.primary"
              component={Link}
              href={paths.cashier.sales.index}
              underline="hover"
            >
              <SvgIcon>
                <ArrowLeftIcon />
              </SvgIcon>
            </Link>
            <Typography variant="h4">Create Customer Order</Typography>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            <Grid2
              container
              spacing={2}
            >
              {/* <Grid2
              item
              xs={12}
            >
              <TYAutocomplete
                options={employeeList}
                formik={formik}
                onChange={(event, newValue) => {
                  formik.setFieldValue('employee', newValue);
                }}
                label="Cashier"
                name="employee"
                getOptionLabel={(option) => `${option.name}`}
                required
              />
            </Grid2> */}
              <Grid2 size={10.5}>
                <TYAutocomplete
                  options={customerList}
                  formik={formik}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('customer', newValue);
                    formik.setFieldValue('contactNo', newValue?.contactNo || '');
                    formik.setFieldValue('email', newValue?.email || '');
                  }}
                  label="Customer Name"
                  name="customer"
                  getOptionLabel={(option) => `${option.customerName}`}
                  required
                />
              </Grid2>
              <Grid2 size={1.5}>
                <Tooltip title="Add new customer">
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpen(true)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Grid2>

              <Grid2 size={12}>
                <TextField
                  value={formik.values.contactNo}
                  name="contactNo"
                  label="Contact number"
                  required
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  value={formik.values.email}
                  name="email"
                  label="Email address"
                  required
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid2>

              <FieldArray name="items">
                {({ push, remove }) => (
                  <>
                    {formik.values.items.map((item, index) => (
                      <Grid2
                        container
                        direction="row"
                        spacing={2}
                        key={index}
                        sx={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          p: 2,
                        }}
                      >
                        <Grid2 size={11}>
                          <TYAutocomplete
                            options={salesItems}
                            formik={formik}
                            onChange={(event, newValue) => {
                              formik.setFieldValue(`items[${index}].menu`, newValue);
                              formik.setFieldValue(
                                `items[${index}].unitPrice`,
                                newValue?.unitPrice || ''
                              );
                              formik.setFieldValue(
                                `items[${index}].discount`,
                                newValue?.discount || ''
                              );
                            }}
                            label="Item Name"
                            name={`items[${index}].menu`}
                            getOptionLabel={(option) => `${option.name}`}
                            required
                            fullWidth
                          />
                        </Grid2>
                        <Grid2 size={1}>
                          <IconButton
                            color="secondary"
                            onClick={() => remove(index)}
                            disabled={formik.values.items.length === 1}
                          >
                            <RemoveCircle />
                          </IconButton>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <TYCurrencyInput
                            label="Qty"
                            name={`items[${index}].quantity`}
                            formik={formik}
                            allowNegative={false}
                            prefix=""
                            decimalScale={0}
                            required
                            fullWidth
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <TextField
                            name={`items[${index}].unitPrice`}
                            label="Unit Price"
                            value={formik.values.items[index].unitPrice}
                            fullWidth
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <TextField
                            name={`items[${index}].discount`}
                            label="Discount(%)"
                            value={formik.values.items[index].discount}
                            fullWidth
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                          />
                        </Grid2>
                        <Divider />
                      </Grid2>
                    ))}
                    <Grid2 size={12}>
                      <Button
                        variant="outlined"
                        sx={{ borderColor: '#90EE90', color: '#65a765' }}
                        onClick={() =>
                          push({ menu: '', quantity: '', unitPrice: '', discount: '' })
                        }
                      >
                        Add Item
                      </Button>
                    </Grid2>
                  </>
                )}
              </FieldArray>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TYCurrencyInput
                  label="Order discount"
                  name="discount"
                  formik={formik}
                  allowNegative={false}
                  suffix="%"
                  min
                  decimalScale={0}
                  required
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TYAutocomplete
                  options={paymentStatus.map((status) => status.name)}
                  label="Payment Status"
                  name=" paymentStatus"
                  getOptionLabel={(option) => `${option}`}
                  formik={formik}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('paymentStatus', newValue);
                  }}
                  required
                  fullWidth
                />
              </Grid2>

              <Grid2 size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={formik.isSubmitting}
                    >
                      Confirm Order
                    </LoadingButton>
                  </Stack>
                </Box>
              </Grid2>
            </Grid2>
          </form>
        </Card>
      </FormikProvider>
    </>
  );
};
