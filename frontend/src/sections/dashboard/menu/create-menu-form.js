import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import toast from 'react-hot-toast';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { FileDropzone } from 'src/components/file-dropzone';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { TYAutocomplete } from 'src/components/ui/ty-autocomplete';
import { menuAPI } from 'src/api/menu';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export const CreateMenuForm = (props) => {
  const { formValues, mutate, onClose, open, categoryList } = props;

  const initialValues = {
    cover: formValues?.cpver ? [formValues.cover] : [],
    category: formValues?.category ?? '',
    menuItem: formValues?.menuItem ?? '',
    unitPrice: formValues?.unitPrice ?? '',
    offer: formValues?.offer ?? '',
    quantity: formValues?.quantity ?? '',
  };

  const validationSchema = Yup.object({
    category: Yup.object().required(' Category is required'),
    menuItem: Yup.string().required('Item name is required'),
    unitPrice: Yup.number().required('Price is required'),
    offer: Yup.number().required('Offer is required'),
    quantity: Yup.number().required('Qty is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('categoryId', values.category._id);
        formData.append('menuItem', values.menuItem);
        formData.append('quantity', values.quantity);
        formData.append('unitPrice', values.unitPrice);
        formData.append('offer', values.offer);

        if (values.cover?.length > 0) {
          formData.append('cover', values.cover[0]);
        }

        await menuAPI.createMenu(formData);
        toast.success('Menu added successfully');
        mutate();
        formik.resetForm();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create Menu Item</DialogTitle>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  borderRadius: '10px',
                  padding: 2,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <TYAutocomplete
                      formik={formik}
                      name="category"
                      label="Category"
                      options={categoryList}
                      getOptionLabel={(option) => `${option?.categoryName}`}
                      onChange={(event, newInputValue) => {
                        formik.setFieldValue('category', newInputValue ?? '');
                      }}
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <TYTextField
                      formik={formik}
                      name="menuItem"
                      label="Item Name"
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <TYCurrencyInput
                      formik={formik}
                      label="Price"
                      name="unitPrice"
                      allowNegative={false}
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <TYTextField
                      formik={formik}
                      label="Offer(%)"
                      name="offer"
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <TYTextField
                      formik={formik}
                      label="Qty"
                      name="quantity"
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Grid
                item
                xs={12}
                md={6}
              >
                <FileDropzone
                  name="cover"
                  caption="(JPG or PNG) Max Size 5MB"
                  maxFiles={1}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
              >
                <LoadingButton
                  type="button"
                  variant="outlined"
                  onClick={onClose}
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={formik.isSubmitting}
                >
                  Add to Item
                </LoadingButton>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      </FormikProvider>
    </Dialog>
  );
};
