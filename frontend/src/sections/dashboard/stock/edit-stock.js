import * as Yup from 'yup';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Box, Typography, Card, IconButton, Button, Divider, SvgIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { Volumes } from 'src/utils/volumes';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { stockApi } from 'src/api/stock';
import Link from 'next/link';
import { paths } from 'src/paths';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { useRouter } from 'next/router';

export const EditStockForm = (props) => {
  const { recipeList, itemsList, isEditMode, formValues, mutate } = props;
  const userId = useSelector((state) => state?.auth?.user?.id);
  const router = useRouter();

  const initialValues = {
    salesItem: {
      _id: formValues?.salesItem?.itemId ?? '',
      name: formValues?.salesItem?.itemName ?? '',
    },
    recipeId: formValues?.recipeId ?? '',
    employeeId: formValues?.employeeId ?? userId,
    totQty: formValues?.totQty ?? 1,
    items: formValues?.items?.map((item) => ({
      _id: item._id ?? '',
      itemId: item.itemId ?? '',
      itemName: item.itemName ?? '',
      quantity: {
        value: item.quantity.value ?? 1,
        volume: item.quantity.volume ?? '',
      },
    })) ?? [
      {
        id: '',
        itemName: '',
        quantity: {
          value: '',
          volume: '',
        },
      },
    ],
    comments: formValues?.comments ?? 'no comments',
  };

  const validationSchema = Yup.object().shape({
    salesItem: Yup.object().shape({
      _id: Yup.string().required('Sale item is required'),
    }),
    totQty: Yup.number()
      .required('Total Quantity is required')
      .min(1, 'Total Quantity must be greater than 0'),
    employeeId: Yup.string().required('Employee ID is required'),
    items: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required('Purchase is required'),
        itemId: Yup.string().required('Purchase item ID is required'),
        itemName: Yup.string().required('Purchase item name is required'),
        quantity: Yup.object().shape({
          value: Yup.number().required('Value is required').min(1, 'Value must be greater than 0'),
          volume: Yup.string().optional(),
        }),
      })
    ),
    comments: Yup.string().optional().max(100, 'Comment must be less than 100 characters'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const reqBody = {
          salesItemId: values.salesItem._id,
          recipeId: values.recipeId,
          employeeId: userId,
          totQty: values.totQty,
          items: values.items.map((item) => ({
            _id: item._id,
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: {
              value: item.quantity.value,
              volume: item.quantity.volume,
            },
          })),
          comments: values.comments,
        };

        if (isEditMode) {
          await stockApi.editStock(formValues._id, reqBody);
          mutate();
          toast.success('Stock Record updated successfully');
        } else {
          await stockApi.createStock(reqBody);
          toast.success('Stock Record created successfully');
        }
        formik.resetForm();
        router.push(paths.dashboard.stock.index);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

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
            component={Link}
            href={paths.dashboard.stock.index}
            underline="hover"
          >
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          </Link>
          <Typography
            variant="h4"
            gutterBottom
          >
            {isEditMode ? 'Edit Stock Record' : 'Create Stock Record'}
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            {isEditMode && (
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  item
                  xs={8}
                >
                  <TYAutocomplete
                    options={recipeList}
                    formik={formik}
                    name="salesItem.name"
                    value={formik.values?.salesItem}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('salesItem._id', newValue._id || '');
                      formik.setFieldValue('salesItem.name', newValue.name || '');
                      formik.setFieldValue('totQty', 1);
                    }}
                    label="Sales Item"
                    required
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                >
                  <TYTextField
                     label="Quantity"
                     name={`totQty`}
                    formik={formik}
                    allowNegative={false}
                    prefix=""
                    decimalScale={0}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {formik.values.items.map((item, index) => {
                          return (
                            <Box key={index}>
                              <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                sx={{ pb: 1 }}
                              >
                                <Grid
                                  item
                                  xs={12}
                                  md={5}
                                >
                                  <TYAutocomplete
                                    options={itemsList || []}
                                    formik={formik}
                                    value={itemsList.find((i) => i._id === item._id) || {}}
                                    onChange={(event, newValue) => {
                                      formik.setFieldValue(
                                        `items.${index}._id`,
                                        newValue?._id || ''
                                      );
                                      formik.setFieldValue(
                                        `items.${index}.itemName`,
                                        newValue?.name || ''
                                      );
                                      formik.setFieldValue(
                                        `items[${index}].quantity.volume`,
                                        newValue?.quantity?.volume || ''
                                      );
                                    }}
                                    label="Purchase Item Name"
                                    name={`items[${index}]._id`}
                                    getOptionLabel={(option) => `${option.name}`}
                                    required
                                    readOnly={isEditMode}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={3}
                                >
                                  <TYCurrencyInput
                                    label="Qty"
                                    name={`items.${index}.quantity.value`}
                                    formik={formik}
                                    allowNegative={false}
                                    prefix=""
                                    decimalScale={0}
                                    required
                                    fullWidth
                                    readOnly={isEditMode}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={4}
                                >
                                  <TYAutocomplete
                                    formik={formik}
                                    label="Volume"
                                    options={Volumes.map((volume) => volume.name)}
                                    name={`items.${index}.quantity.volume`}
                                    value={formik.values.items[index].quantity.volume}
                                    getOptionLabel={(option) => option || ''}
                                    onChange={(event, newValue) => {
                                      formik.setFieldValue(
                                        `items.${index}.quantity.volume`,
                                        newValue
                                      );
                                    }}
                                    fullWidth
                                    defaultValue={Volumes[0].name}
                                    readOnly={isEditMode}
                                  />
                                </Grid>
                                {/* <Grid
                                  item
                                  xs={12}
                                  md={4}
                                  display="flex"
                                  alignItems="center"
                                >
                                  {formik.values.items.length > 1 && (
                                    <IconButton
                                      color="secondary"
                                      onClick={() => remove(index)}
                                      disabled={isEditMode}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </Grid> */}
                              </Grid>
                              <Divider sx={{ my: 0.5 }} />
                            </Box>
                          );
                        })}
                      </>
                    )}
                  </FieldArray>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{ mt: 2 }}
                  >
                    <TYTextField
                      label="Additional Comments"
                      name="comments"
                      formik={formik}
                      fullWidth
                      multiline
                      value={formik.values.comments}
                    />
                  </Grid>
                </Grid>
                {/* <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <TYCurrencyInput
                    label="Discount"
                    name="discount"
                    formik={formik}
                    allowNegative={false}
                    suffix="%"
                    decimalScale={0}
                    fullWidth
                  />
                </Grid> */}
                <Grid
                  item
                  xs={12}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <LoadingButton
                        variant="outlined"
                        onClick={() => formik.resetForm()}
                      >
                        Reset
                      </LoadingButton>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={formik.isSubmitting}
                      >
                        {isEditMode ? 'Edit Stock Record' : 'Add Stock Record'}
                      </LoadingButton>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            )}
          </form>
        </FormikProvider>
      </Box>
    </Card>
  );
};
