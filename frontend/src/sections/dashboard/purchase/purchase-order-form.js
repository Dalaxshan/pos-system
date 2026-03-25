import * as Yup from 'yup';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  TextField,
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Divider,
  SvgIcon,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { Volumes } from 'src/utils/volumes';
import { purchaseOrderApi } from 'src/api/purchase';
import Link from 'next/link';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';

export const PurchaseOrderForm = (props) => {
  const { formValues, itemsList, supplierList, isEditMode, mutate } = props;
  const userId = useSelector((state) => state?.auth?.user?.id);
  const router = useRouter();

  const initialValues = {
    company: {
      _id: formValues?.supplierId?._id ?? '',
      companyName: formValues?.supplierId?.companyName ?? '',
      email: formValues?.supplierId?.email ?? '',
      contactNumber: formValues?.supplierId?.contactNumber ?? '',
    },
    employeeId: formValues?.employeeId?._id ?? userId,
    items: formValues?.items?.map((item) => ({
      _id: item._id ?? '',
      itemName: item.itemName ?? '',
      quantity: {
        value: item.quantity?.value ?? 1,
        volume: item.quantity?.volume ?? '',
      },
      price: item.price ?? 0,
      discount: item.discount ?? 0,
    })) ?? [
      {
        _id: '',
        itemName: '',
        quantity: {
          value: 1,
          volume: '',
        },
        price: 0,
        discount: 0,
      },
    ],
    deliveryStatus: formValues?.deliveryStatus ?? 'pending',
    paymentStatus: formValues?.paymentStatus ?? 'unpaid',
    orderDiscount: formValues?.discount ?? 0,
  };

  const validationSchema = Yup.object().shape({
    company: Yup.object().required('Company is required!'),
    employeeId: Yup.string().required('Employee ID is required'),
    items: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required('Item is required'),
        quantity: Yup.object().shape({
          value: Yup.number().min(0).required('Value is required').min(1, 'Value must be greater than 0'),
          volume: Yup.string().optional(),
        }),
        price: Yup.number().min(0).required('Price is required'),
        discount: Yup.number().optional().min(0, 'Discount cannot be negative').max(100, 'Discount cannot be more than 100%')

      })
    ),
    deliveryStatus: Yup.string().required('Delivery status is required'),
    paymentStatus: Yup.string().required('Payment status is required'),
    orderDiscount: Yup.number().optional().min(0, 'Discount cannot be negative').max(100, 'Discount cannot be more than 100%'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const reqBody = {
          supplierId: values.company._id,
          employeeId: userId,
          items: values.items.map((item) => ({
            itemId: item._id,
            quantity: {
              value: item.quantity.value,
              volume: item.quantity.volume,
            },
            discount: item.discount,
            price: item.price,
          })),
          deliveryStatus: values.deliveryStatus,
          paymentStatus: values.paymentStatus,
          discount: values.orderDiscount,
        };
        if (isEditMode) {
          await purchaseOrderApi.editPurchase(formValues._id, reqBody);
          mutate();
          toast.success('Order updated successfully');
        } else {
          await purchaseOrderApi.createPurchaseOrder(reqBody);
          toast.success('Order created successfully');
          handleReset();
        }
        router.push(paths.dashboard.purchase.index);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };
  return (
    <Card sx={{ p: 4, mx: 'auto', my: 5, maxWidth: 800 }}>
      <Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ pb: 2 }}
        >
          <Link
            color="text.primary"
            href={paths.dashboard.purchase.index}
            underline="hover"
          >
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          </Link>

          <Typography variant="h4">
            {isEditMode ? 'Edit Purchase Order' : 'Create Purchase Order'}
          </Typography>
        </Stack>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Grid2
              container
              spacing={2}
              direction="row"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid2 size={12}>
                <TYAutocomplete
                  formik={formik}
                  label="Company Name"
                  name="company.companyName"
                  options={supplierList}
                  value={formik.values?.company}
                  getOptionLabel={(option) => option.companyName || ''}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('company._id', newValue?._id || '');
                    formik.setFieldValue('company.companyName', newValue?.companyName || '');
                    formik.setFieldValue('company.email', newValue?.email || '');
                    formik.setFieldValue('company.contactNumber', newValue?.contactNumber || '');
                  }}
                  required
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company Email"
                  value={formik.values.company.email || ''}
                  fullWidth
                  slotProps={{
                    input: { readOnly: true },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company Contact No"
                  value={formik.values.company.contactNumber || ''}
                  fullWidth
                  slotProps={{
                    input: { readOnly: true },
                  }}
                />
              </Grid2>
              <Grid2 size={12}>
                <Divider sx={{ my: 1 }}>Purchase items</Divider>
              </Grid2>
              <Grid2 size={12}>
                <FieldArray
                  name="items"
                  render={({ push, remove }) => (
                    <>
                      {formik.values.items.map((item, index) => (
                        <Box key={index}>
                          <Grid2
                            container
                            spacing={2}
                            sx={{ alignItems: 'center', pb: 1 }}
                          >
                            <Grid2 size={{ xs: 12, md: 3.5 }}>
                              <TYAutocomplete
                                options={itemsList || []}
                                formik={formik}
                                value={itemsList.find((i) => i._id === item._id) || {}}
                                onChange={(event, newValue) => {
                                  formik.setFieldValue(`items[${index}]._id`, newValue?._id || '');
                                  formik.setFieldValue(
                                    `items[${index}].itemName`,
                                    newValue?.name || ''
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].quantity.value`,
                                    newValue?.quantity?.value || ''
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].quantity.volume`,
                                    newValue?.quantity?.volume || ''
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].price`,
                                    newValue?.unitPrice || 0
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].discount`,
                                    newValue?.discount || 0
                                  );
                                }}
                                label="Item Name"
                                name={`items[${index}]._id`}
                                getOptionLabel={(option) => option.name || ''}
                                required
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 1.5 }}>
                              <TYCurrencyInput
                                label="Qty"
                                name={`items[${index}].quantity.value`}
                                formik={formik}
                                allowNegative={false}
                                prefix=""
                                decimalScale={0}
                                required
                                fullWidth
                                slotProps={{
                                  input: { readOnly: true },
                                }}
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 2.5 }}>
                              <TYAutocomplete
                                formik={formik}
                                label="Volume"
                                options={Volumes.map((volume) => volume.name) || []}
                                name={`items[${index}].quantity.volume`}
                                value={formik.values.items[index].quantity.volume || ''}
                                getOptionLabel={(option) => option || ''}
                                 slotProps={{
                                  input: { readOnly: true },
                                }}
                                onChange={(event, newValue) => {
                                  formik.setFieldValue(
                                    `items[${index}].quantity.volume`,
                                    newValue || ''
                                  );
                                  
                                }}
                                required
                              />
                            </Grid2>
                          
                            <Grid2 size={{ xs: 12, md: 1.5 }}>
                              <TYCurrencyInput
                                label="Discount"
                                value={`${formik.values.items[index].discount || 0}`}
                                name={`items[${index}].discount`}
                                formik={formik}
                                suffix="%"
                                fullWidth
                              
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 2 }}>
                              <TextField
                                label="Unit Price"
                                value={`${formik.values.items[index].price || 0} LKR`}
                                fullWidth
                                slotProps={{
                                  input: { readOnly: true },
                                }}
                              />
                            </Grid2>
                            {formik.values.items.length > 1 && (
                              <Grid2 size={{ xs: 12, md: 1 }}>
                                <IconButton
                                  color="secondary"
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid2>
                            )}
                          </Grid2>
                        </Box>
                      ))}

                      <Grid2
                        container
                        justifyContent="flex-end"
                        sx={{ pt: 1, pb: 1 }}
                      >
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() =>
                            push({
                              _id: '',
                              itemName: '',
                              quantity: { value: 1, volume: '' },
                              price: 0,
                            })
                          }
                        >
                          Add Item
                        </Button>
                      </Grid2>
                    </>
                  )}
                />

                <Grid2 size={12}>
                  <TYCurrencyInput
                    label="Order Discount"
                    name="orderDiscount"
                    formik={formik}
                    allowNegative={false}
                    suffix="%"
                    decimalScale={0}
                    fullWidth
                  />
                </Grid2>
              </Grid2>
              <Grid2 size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <LoadingButton
                      variant="outlined"
                      onClick={handleReset}
                    >
                      Reset
                    </LoadingButton>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={formik.isSubmitting}
                    >
                      {isEditMode ? 'Edit Order' : 'Add Order'}
                    </LoadingButton>
                  </Stack>
                </Box>
              </Grid2>
            </Grid2>
          </form>
        </FormikProvider>
      </Box>
    </Card>
  );
};
