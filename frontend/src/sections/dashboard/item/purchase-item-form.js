import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { itemAPI } from 'src/api/item';
import { Card, Typography, Stack, SvgIcon, Box, Grid2, IconButton, Divider } from '@mui/material';
import Link from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { paths } from 'src/paths';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { FileDropzone } from 'src/components/file-dropzone';
import { Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Volumes } from 'src/utils/volumes';
import { useRouter } from 'next/router';

export const PurchaseItemForm = (props) => {
  const { formValues, supplierList, isLoadingSuppliers, editMode = false, itemId, mutate } = props;
  const userId = useSelector((state) => state?.auth?.user?.id);
  const router = useRouter();

  const initialValues = {
    supplierId: formValues?.supplierId?._id ? { _id: formValues.supplierId._id, companyName: formValues.supplierId.companyName } : null,
    items: [
      {
        name: formValues?.name ?? '',
        description: formValues?.description ?? '',
        unitPrice: formValues?.unitPrice ?? 0,
        quantity: {
          value: formValues?.quantity?.value ?? 1,
          volume: formValues?.quantity?.volume ?? 'units',
        },
        discount: formValues?.discount ?? 0,
        itemImage: formValues?.itemImage ? [formValues.itemImage] : [],
      },
    ],
  };

  const validationSchema = Yup.object({
    supplierId: Yup.object().nullable().required('A supplier is required'),
    items: Yup.array().of(
      Yup.object({
        name: Yup.string().max(80).required('Item name is required'),
        description: Yup.string().max(300),
        quantity: Yup.object({
          value: Yup.number().min(0).required('Value is required!'),
          volume: Yup.string().optional(),
        }),
        unitPrice: Yup.number().min(0).required('Price is required'),
        discount: Yup.number().optional().min(0, 'Discount cannot be negative').max(100, 'Discount cannot be more than 100%'),
        itemImage: Yup.array().max(1, 'Only 1 image can be added for an item'),
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await Promise.all(
          values.items.map(async (item) => {
            const formData = new FormData();
            formData.append('supplierId', values.supplierId._id);
            formData.append('description', item.description);
            formData.append('name', item.name);
            formData.append('quantity[value]', item.quantity.value);
            formData.append('quantity[volume]', item.quantity.volume);
            formData.append('unitPrice', item.unitPrice);
            formData.append('discount', item.discount);
            formData.append('isForSale', false);

            if (item.itemImage.length > 0) {
              formData.append('itemImage', item.itemImage[0]);
            }

            formData.append('employeeId', userId);
            if (editMode) {
              await itemAPI.updateItem(itemId, formData);
              mutate();
              toast.success('Purchase item updated successfully');
            } else {
              await itemAPI.createItem(formData);
              toast.success('Purchase items created successfully');
              formik.resetForm();
            }
            router.push(paths.dashboard.item.index);  
          
          })
        );
      } catch (error) {
        toast.error(error.message || 'Failed to create purchase item');
      }
    },
  });

  return (
    <Card sx={{ p: 4 }}>
      <Stack
        direction="row"
        spacing={1}
      >
        <Link
          color="text.primary"
          href={paths.dashboard.item.index}
          underline="hover"
        >
          <SvgIcon>
            <ArrowLeftIcon />
          </SvgIcon>
        </Link>
        <Typography variant="h4">
          {editMode ? 'Edit Purchase Item' : 'Create Purchase Item'}
        </Typography>
      </Stack>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Grid2
            container
            spacing={2}
          >
            <Grid2 size={12}>
              <Box sx={{ borderRadius: '10px', padding: 2, backgroundColor: '#FFFFFF' }}>
              <TYAutocomplete
                formik={formik}
                options={supplierList || []}
                name="supplierId"
                loading={isLoadingSuppliers}
                getOptionLabel={(option) => option.companyName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                label="Supplier"
                onChange={(event, newValue) => {
                  formik.setFieldValue('supplierId', newValue);
                }}
                value={formik.values.supplierId}
                required
              />
              </Box>
            </Grid2>
          </Grid2>

          <FieldArray
            name="items"
            render={({ push, remove }) => (
              <>
                {formik.values.items.map((item, index) => (
                  <div key={index}>
                    <Grid2
                      container
                      spacing={1}
                      sx={{ pl: 2, pr: 2, backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    >
                      <Grid2 size={12}>
                        {!editMode && (
                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{ justifyContent: 'flex-end' }}
                          >
                            <IconButton
                              color="secondary"
                              onClick={() => remove(index)}
                            >
                              <SvgIcon>
                                <Delete sx={{ color: '#FF5151' }} />
                              </SvgIcon>
                            </IconButton>
                          </Stack>
                        )
                        }
                      </Grid2>
                      <Grid2 size={12}>
                        <TYTextField
                          formik={formik}
                          name={`items[${index}].name`}
                          label="Item Name"
                          required
                          fullWidth
                        />
                      </Grid2>
                      <Grid2 size={12}>
                        <TYTextField
                          multiline
                          formik={formik}
                          name={`items[${index}].description`}
                          label="Description"
                          minRows={2}
                          fullWidth
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 3 }}>
                        <TYCurrencyInput
                          formik={formik}
                          label="Unit Price"
                          name={`items[${index}].unitPrice`}
                          prefix="LKR "
                          allowNegative={false}
                          required
                          fullWidth
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 3 }}>
                        <TYCurrencyInput
                          formik={formik}
                          label="Qty"
                          name={`items[${index}].quantity.value`}
                          allowNegative={false}
                          required
                          fullWidth
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 3 }}>
                        <TYAutocomplete
                          formik={formik}
                          label="Volume"
                          options={Volumes.map((volume) => volume.name) || []}
                          name={`items[${index}].quantity.volume`}
                          getOptionLabel={(option) => `${option}`}
                          onChange={(event, newValue) => {
                            formik.setFieldValue(`items[${index}].quantity.volume`, newValue);
                          }}
                          value={formik.values.items[index].quantity.volume}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 3 }}>
                        <TYCurrencyInput
                          formik={formik}
                          label="Discount (%)"
                          name={`items[${index}].discount`}
                          suffix="%"
                          required
                          fullWidth
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12 }}>
                        <FileDropzone
                          name={`items[${index}].itemImage`}
                          maxFiles={1}
                          caption="(JPG or PNG) Max Size 5MB"
                        />
                      </Grid2>
                      <Divider sx={{ height: '2', color: 'red' }} />
                    </Grid2>

                    {index < formik.values.items.length - 1 && <Divider sx={{ my: 2 }} />}
                  </div>
                ))}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 2, pl: 2 }}
                >
                  {!editMode && (
                    <LoadingButton
                      color="primary"
                      variant="outlined"
                      onClick={() =>
                        push({
                          name: '',
                          description: '',
                          unitPrice: 1,
                          quantity: { value: 1, volume: 'units' },
                          discount: 0,
                          itemImage: [],
                        })
                      }
                    >
                      Add another item
                    </LoadingButton>
                  )}
                </Stack>
              </>
            )}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'flex-end', alignItems: 'center', mt: 3 }}
          >
            <LoadingButton
              color="error"
              variant="outlined"
              onClick={formik.resetForm}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              color="primary"
              variant="contained"
              type="submit"
              loading={formik.isSubmitting}
            >
              {editMode ? 'Edit' : 'Create '}
            </LoadingButton>
          </Stack>
        </form>
      </FormikProvider>
    </Card>
  );
};