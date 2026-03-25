import * as Yup from 'yup';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { itemAPI } from 'src/api/item';
import { Typography, Stack, IconButton, Box, Dialog } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Volumes } from 'src/utils/volumes';
import { recipeAPI } from 'src/api/recipe';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

export const CreateRecipeForm = (props) => {
  const { open, handleClose, itemId, editMode, recipe, mutate } = props;
  const userId = useSelector((state) => state?.auth?.user?.id);

  // Get all categories list
  const { data: purchaseItemList = [], isLoading: isLoadingCategory } = useSWRImmutable(
    ['purchase-item'],
    async () => {
      const response = await itemAPI.getAllPurchaseItem();
      return response;
    }
  );

  const initialValues = {
    ingredients: recipe
      ? recipe.ingredients?.map((ingredient) => ({
          item: {
            _id: ingredient._id,
            name: ingredient.itemName,
          },
          quantity: {
            value: ingredient.quantity.value,
            volume: ingredient.quantity.volume || Volumes[0].name,
          },
        }))
      : [
          {
            item: null,
            quantity: { value: 1, volume: Volumes[0].name },
          },
        ],
  };

  const validationSchema = Yup.object({
    ingredients: Yup.array().of(
      Yup.object({
        item: Yup.object().nullable().required('Item name is required!'),
        quantity: Yup.object({
          value: Yup.number().required('Value is required!'),
          volume: Yup.string().required('Volume is required'),
        }),
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values) => {
      try {
        const reqBody = {
          saleItemId: itemId,
          ingredients: values.ingredients?.map((item) => ({
            itemId: item.item._id,
            quantity: {
              value: item.quantity.value,
              volume: item.quantity.volume || 'noOfItems',
            },
          })),
          chefId: userId,
        };

        if (editMode) {
          await recipeAPI.editRecipeById(recipe._id, reqBody);
          toast.success('Recipe edited successfully');
        } else {
          await recipeAPI.createRecipe(reqBody);
          toast.success('Recipe created successfully');
          formik.resetForm();
        }
        mutate();
        handleClose();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <Box sx={{ p: 4 }}>
        <Stack
          direction="row"
          spacing={1}
        >
          <Typography
            variant="h4"
            sx={{ pb: 4 }}
          >
            {editMode ? 'Edit Recipe' : 'Create Recipe'}
          </Typography>
        </Stack>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FieldArray
              name="ingredients"
              render={({ push, remove }) => (
                <>
                  {formik.values.ingredients?.map((item, index) => (
                    <div key={index}>
                      <Grid2
                        container
                        spacing={1}
                        sx={{ borderRadius: '10px', px: 1 }}
                      >
                        <Grid2 size={{ xs: 12, md: 6.5 }}>
                          <TYAutocomplete
                            options={purchaseItemList || []}
                            formik={formik}
                            value={formik.values.ingredients[index].item}
                            onChange={(event, newValue) => {
                              formik.setFieldValue(`ingredients.${index}.item`, newValue);
                              formik.setFieldValue(
                                `ingredients.${index}.quantity.volume`,
                                newValue.quantity.volume
                              );
                            }}
                            label="Item Name"
                            name={`ingredients[${index}].item`}
                            loading={isLoadingCategory}
                            getOptionLabel={(option) => option.name || ''}
                          />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 2 }}>
                          <TYCurrencyInput
                            formik={formik}
                            label="Qty"
                            name={`ingredients.${index}.quantity.value`}
                            allowNegative={false}
                            required
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 3 }}>
                          <TYAutocomplete
                            formik={formik}
                            label="Volume"
                            value={formik.values.ingredients[index].quantity.volume}
                            options={Volumes.map((volume) => volume.name)}
                            name={`ingredients.${index}.quantity.volume`}
                            getOptionLabel={(option) => option}
                            onChange={(event, newValue) => {
                              formik.setFieldValue(
                                `ingredients.${index}.quantity.volume`,
                                newValue
                              );
                            }}
                          />
                        </Grid2>
                        <Grid2
                          size={{ xs: 12, md: 0.5 }}
                          sx={{ mt: 1 }}
                        >
                          <IconButton
                            color="secondary"
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid2>
                      </Grid2>
                      {index < formik.values.ingredients.length - 1 && <Divider sx={{ my: 1 }} />}
                    </div>
                  ))}

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2, pl: 1 }}
                  >
                    <LoadingButton
                      color="primary"
                      variant="outlined"
                      onClick={() =>
                        push({
                          item: null,
                          quantity: { value: 1, volume: Volumes[0].name },
                        })
                      }
                    >
                      Add item
                    </LoadingButton>
                  </Stack>
                </>
              )}
            />

            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: 'flex-end',
              }}
            >
              <LoadingButton
                color="primary"
                variant="contained"
                type="submit"
                loading={formik.isSubmitting}
              >
                {editMode ? 'Save Changes' : 'Add Recipe'}
              </LoadingButton>
            </Stack>
          </form>
        </FormikProvider>
      </Box>
    </Dialog>
  );
};
