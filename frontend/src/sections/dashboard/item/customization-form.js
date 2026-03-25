import { Grid2, IconButton, Divider, Checkbox } from '@mui/material';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { FieldArray } from 'formik';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Add, Delete } from '@mui/icons-material';

export const CustomizationFields = ({ formik, index }) => (
  <FieldArray
    name={`items[${index}].customizations`}
    render={({ push, remove }) => (
      <Grid2
        container
        spacing={2}
      >
        <Divider sx={{ width: '100%' }}>Variations</Divider>
        {formik.values.items[index].customizations?.map((customization, customizationIndex) => (
          <Grid2
            spacing={2}
            key={customizationIndex}
            sx={{ width: '100%', justifyContent: 'space-around' }}
            display="flex"
            direction="row"
          >
            <Grid2 size={6}>
              <TYTextField
                formik={formik}
                name={`items[${index}].customizations[${customizationIndex}].variation`}
                label="Variation"
                fullWidth
              />
            </Grid2>
            <Grid2 size={4}>
              <TYCurrencyInput
                formik={formik}
                prefix="LKR "
                allowNegative={false}
                name={`items[${index}].customizations[${customizationIndex}].price`}
                label="Price"
                fullWidth
              />
            </Grid2>
            <Grid2 size={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      formik.values.items[index].customizations[customizationIndex].isRequired
                    }
                    onChange={(e) =>
                      formik.setFieldValue(
                        `items[${index}].customizations[${customizationIndex}].isRequired`,
                        e.target.checked
                      )
                    }
                    name={`items[${index}].customizations[${customizationIndex}].isRequired`}
                    color="primary"
                  />
                }
                label="Required"
              />
            </Grid2>
            <Grid2 size={1}>
              <IconButton onClick={() => remove(customizationIndex)}>
                <Delete sx={{ color: 'red' }} />
              </IconButton>
            </Grid2>
          </Grid2>
        ))}
        <Grid2 size={12}>
          <IconButton onClick={() => push({ variation: '', price: 0, isRequired: true })}>
            <Add sx={{ color: 'info.main', border: '2px solid', borderRadius: '30px' }} />
          </IconButton>
        </Grid2>
      </Grid2>
    )}
  />
);
