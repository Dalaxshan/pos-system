import * as Yup from 'yup';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { Box, Typography, Card, IconButton, Button, Divider, SvgIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { Volumes } from 'src/utils/volumes';
import Link from 'next/link';
import { paths } from 'src/paths';
import { stockApi } from 'src/api/stock';
import { recipeAPI } from 'src/api/recipe';
import { useEffect, useState } from 'react';
import { Error } from 'src/components/error';
import { useRouter } from 'next/router';

export const CreateStockForm = (props) => {
  const { formValues, recipeList, itemsList, isEditMode, mutate } = props;
  const userId = useSelector((state) => state?.auth?.user?.id);

  // State to manage selected recipe's ingredients
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [errorIngredients, setErrorIngredients] = useState(null);
  const [defaultIngredients, setDefaultIngredients] = useState([]);
  const router = useRouter();

  const initialValues = {
    recipe: formValues?.recipe || '',
    employeeId: formValues?.employeeId?._id ?? userId,
    totQty: formValues?.totQty ?? 1,
    items: formValues?.items?.map((item) => ({
      _id: item.itemId,
      itemName: item.itemName,
      quantity: {
        value: item.quantity.value,
        volume: item.quantity.volume,
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
    comments: formValues?.comments ?? '',
  };

  const validationSchema = Yup.object().shape({
    recipe: Yup.object().required('Sale item is required'),
    totQty: Yup.number()
      .required('Total Quantity is required')
      .min(1, 'Total Quantity must be greater than 0'),
    employeeId: Yup.string().required('Employee ID is required'),
    items: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required('Purchase is required'),
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
          recipeId: values.recipe.recipeId._id,
          salesItemId: values.recipe._id,
          employeeId: userId,
          totQty: values.totQty,
          items: values.items.map((item) => ({
            itemId: item._id,
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
          toast.success('Stock updated successfully');
        } else {
          await stockApi.createStock(reqBody);
          toast.success('Stock created successfully');
          handleReset();
        }
        router.push(paths.dashboard.stock.index);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };

  const fetchIngredients = async (recipeId) => {
    setLoadingIngredients(true);
    try {
      const response = await recipeAPI.getRecipeById(recipeId);
      formik.setFieldValue('items', response.ingredients || []);
      setDefaultIngredients(response.ingredients || []);
      setErrorIngredients(null);
    } catch (error) {
      setErrorIngredients('Failed to load ingredients');
    } finally {
      setLoadingIngredients(false);
    }
  };

  useEffect(() => {
    if (formik.values.recipe) {
      fetchIngredients(formik.values.recipe?.recipeId?._id);
      formik.setFieldValue('totQty', 1);
    }
  }, [formik.values.recipe, formik.values.recipe?.recipeId?._id]);

  // Watch for changes in totQty and update the items' quantity
  useEffect(() => {
    const { totQty } = formik.values;

    if (totQty > 0) {
      const updatedItems = defaultIngredients.map((ingredient) => ({
        ...ingredient,
        quantity: {
          ...ingredient.quantity,
          value: ingredient.quantity.value * totQty,
        },
      }));
      formik.setFieldValue('items', updatedItems);
    } else if (totQty === 0) {
      formik.setFieldValue('items', defaultIngredients);
    }
  }, [formik.values.totQty, formik.values.recipe]);

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
            href={paths.dashboard.stock.index}
            underline="hover"
          >
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          </Link>

          <Typography variant="h4">
            {isEditMode ? 'Edit Stock Record' : 'Create Stock Record'}
          </Typography>
        </Stack>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Grid2
              container
              spacing={2}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid2 size={{ xs: 12, md: 8 }}>
                <TYAutocomplete
                  options={recipeList}
                  formik={formik}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('recipe', newValue);
                    formik.setFieldValue('totQty', 1);
                  }}
                  label="Sales Item"
                  name="recipe"
                  getOptionLabel={(option) => `${option.name}`}
                  required
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <TYCurrencyInput
                  label="Quantity"
                  name={`totQty`}
                  formik={formik}
                  allowNegative={false}
                  prefix=""
                  decimalScale={0}
                  required
                  fullWidth
                />
              </Grid2>
              <Grid2 size={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6">Ingredients</Typography>
              </Grid2>

              <Grid2 size={12}>
                {loadingIngredients ? (
                  <Typography>Loading ingredients...</Typography>
                ) : errorIngredients ? (
                  <Error
                    title="Failed to load ingredients"
                    statusCode="500"
                  />
                ) : formik.values?.items?.length > 0 ? (
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {formik.values.items.map((item, index) => (
                          <Box key={index}>
                            <Grid2
                              container
                              spacing={2}
                              alignItems="center"
                              sx={{ pb: 1 }}
                            >
                              <Grid2 size={{ xs: 12, md: 5 }}>
                                <TYAutocomplete
                                  options={itemsList || []}
                                  formik={formik}
                                  value={itemsList.find((i) => i._id === item._id) || {}}
                                  onChange={(event, newValue) => {
                                    formik.setFieldValue(`items.${index}._id`, newValue?._id || '');
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
                                  name={`items.${index}._id`}
                                  getOptionLabel={(option) => option.name || ''}
                                  required
                                />
                              </Grid2>
                              <Grid2 size={{ xs: 12, md: 3 }}>
                                <TYCurrencyInput
                                  label="Qty"
                                  name={`items.${index}.quantity.value`}
                                  formik={formik}
                                  allowNegative={false}
                                  prefix=""
                                  decimalScale={0}
                                  required
                                  fullWidth
                                />
                              </Grid2>
                              <Grid2 size={{ xs: 12, md: 4 }}>
                                <TYAutocomplete
                                  formik={formik}
                                  label="Volume"
                                  options={Volumes.map((volume) => volume.name) || []}
                                  name={`items.${index}.quantity.volume`}
                                  value={formik.values.items[index].quantity.volume || ''}
                                  getOptionLabel={(option) => option || ``}
                                  onChange={(event, newValue) => {
                                    formik.setFieldValue(
                                      `items.${index}.quantity.volume`,
                                      newValue || ''
                                    );
                                  }}
                                  fullWidth
                                  required
                                />
                              </Grid2>
                              <Grid2
                                size={{ xs: 12, md: 4 }}
                                display="flex"
                                alignItems="center"
                              >
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  onClick={() =>
                                    push({
                                      _id: '',
                                      itemName: '',
                                      quantity: { value: 1, volume: '' },
                                    })
                                  }
                                  sx={{ mr: 2 }}
                                >
                                  Add Item
                                </Button>
                                {formik.values.items.length > 1 && (
                                  <IconButton
                                    color="secondary"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Grid2>
                            </Grid2>
                            <Divider sx={{ my: 0.5 }} />
                          </Box>
                        ))}
                      </>
                    )}
                  </FieldArray>
                ) : (
                  <Typography>No ingredients available</Typography>
                )}
                <Grid2
                  size={12}
                  sx={{ mt: 2 }}
                >
                  <TYTextField
                    label="Additional Comments"
                    name="comments"
                    formik={formik}
                    multiline
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
                      Cancel
                    </LoadingButton>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={formik.isSubmitting}
                    >
                      {isEditMode ? 'Edit record' : 'Add record'}
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
