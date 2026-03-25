import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { FileDropzone } from 'src/components/file-dropzone';
import { itemAPI } from 'src/api/item';
import { Card, Typography, Stack, SvgIcon, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { paths } from 'src/paths';
import { useSelector } from 'react-redux';
import { CustomizationFields } from './customization-form';
import { Delete } from '@mui/icons-material';
import { useRouter } from 'next/router';

export const SaleItemForm = (props) => {
  const { formValues, categoryList, isLoadingCategories, editMode = false, itemId, mutate } = props;
  const userId = useSelector((state) => state?.auth?.user?.id);
  const router = useRouter();

  const initialValues = {
    categoryId: formValues?.categoryId?._id ? { _id: formValues.categoryId._id, name: formValues.categoryId.name } : null,
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
        customizations: formValues?.customizations?.map((customization) => ({
          variation: customization.variation ?? '',
          price: customization.price ?? 0,
          isRequired: customization.isRequired ?? false,
        })) ?? [{ variation: '', price: 0, isRequired: true }],
      },
    ],
  };

  const validationSchema = Yup.object({
    categoryId: Yup.object().nullable().required('A category is required'),
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
        customizations: Yup.array().of(
          Yup.object({
            variation: Yup.string().max(30, 'Variation must be at most 30 characters'),
            price: Yup.number().min(0),
            isRequired: Yup.boolean().oneOf([true, false], 'Must be true or false'),
          })
        ),
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
            formData.append('categoryId', values.categoryId._id);
            formData.append('description', item.description);
            formData.append('name', item.name);
            formData.append('quantity[value]', item.quantity.value);
            formData.append('quantity[volume]', item.quantity.volume);
            formData.append('unitPrice', item.unitPrice);
            formData.append('discount', item.discount);
            formData.append('isForSale', true);
            formData.append('employeeId', userId);

            if (item.itemImage.length > 0) {
              formData.append('itemImage', item.itemImage[0]);
            }

            item.customizations.forEach((customization, index) => {
              formData.append(`customizations[${index}][variation]`, customization.variation);
              formData.append(`customizations[${index}][price]`, customization.price);
              formData.append(`customizations[${index}][isRequired]`, customization.isRequired);
            });

            if (editMode) {
              await itemAPI.updateItem(itemId, formData);
              mutate();
              toast.success('Sale item updated successfully');
            } else {
              await itemAPI.createItem(formData);
              toast.success('Sale items created successfully');
              formik.resetForm();
            }

            router.push(paths.dashboard.item.index);
          })
        );
      } catch (error) {
        toast.error(error.message || 'Failed to create sale item');
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
        <Typography variant="h4"> {editMode ? 'Edit Sale Item' : 'Create Sale Item'}</Typography>
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
                  options={categoryList || []}
                  name="categoryId"
                  loading={isLoadingCategories}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  label="Category Name"
                  value={formik.values.categoryId}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('categoryId', newValue);
                  }}
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
                      <Grid2 size={{ xs: 12, md: 4 }}>
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
                      <Grid2 size={{ xs: 12, md: 4 }}>
                        <TYCurrencyInput
                          formik={formik}
                          label="Qty"
                          name={`items[${index}].quantity.value`}
                          allowNegative={false}
                          required
                          fullWidth
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 4 }}>
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
                    </Grid2>
                    <CustomizationFields
                      formik={formik}
                      index={index}
                    />
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
                          customizations: [{ variation: '', price: 0, isRequired: true }],
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
              {editMode ? 'Edit' : 'Create'}
            </LoadingButton>
          </Stack>
        </form>
      </FormikProvider>
    </Card>
  );
};