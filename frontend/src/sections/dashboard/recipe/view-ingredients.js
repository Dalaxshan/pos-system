import {
  Dialog,
  Typography,
  Box,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Stack } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TYTextField } from 'src/components/ui/ty-textfield';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { itemAPI } from 'src/api/item';
import { recipeAPI } from 'src/api/recipe';

const ViewIngredients = (props) => {
  const { open, handleClose, data, mutate } = props;
  const recipeId = data?.recipeId?._id;

  const [recipeStatuses, setRecipeStatuses] = useState([]);

  const initialValues = {
    comment: data?.recipeId?.comment || '',
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      comment: Yup.string().required('Comment is required'),
    }),

    onSubmit: async (values) => {
      try {
        await recipeAPI.editComment(recipeId, { comment: values.comment });
        toast.success('Comment updated successfully');
        mutate();
      } catch (error) {
        console.error('Error updating comment:', error);
        toast.error('Failed to add comment');
      }
    },
  });

  useEffect(() => {
    if (data?.recipeId?.ingredients) {
      setRecipeStatuses(data?.recipeId?.ingredients?.map((item) => item.recipeStatus || 'not-approved'));
    }
  }, [data]);

  const updateRecipeStatus = async (itemId, status) => {
    try {
      await itemAPI.updateRecipeStatus(itemId, status);
      mutate();
      toast.success('Recipe status changed successfully');
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
  };

  const handleStatusChange = (index, itemId, currentStatus) => {
    const nextStatus = currentStatus === 'not-approved' ? 'approved' : 'not-approved';

    const updatedStatuses = [...recipeStatuses];
    updatedStatuses[index] = nextStatus;
    setRecipeStatuses(updatedStatuses);
    updateRecipeStatus(itemId, nextStatus);
  };

  const handleButtonClick = (event, index, itemId, currentStatus) => {
    event.stopPropagation();
    handleStatusChange(index, itemId, currentStatus);
  };

  const recipeNameConverted = (name) => {
    return name.toUpperCase();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography
          variant="h5"
          align="center"
          sx={{ pt: 2, fontWeight: 'bold', color: 'primary.main' }}
        >
          Check Ingredients
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Box
          sx={{
            maxHeight: '90vh',
            overflowY: 'auto',
            '::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent',
            },
          }}
        >
          <Divider sx={{ mb: 2 }} />

          {data?.recipeId?.ingredients && data.recipeId.ingredients.length > 0 ? (
            <List disablePadding sx={{ pt: 2 }}>
              {data?.recipeId?.ingredients.map((item) => (
                <ListItem disableGutters key={item.itemId} sx={{ pb: 2, pt: 0 }}>
                  <ListItemText
                    disableTypography
                    primary={
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'medium', color: 'text.primary' }}
                        >
                          {item.itemId}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'medium', color: 'text.primary' }}
                        >
                          {item.itemName}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: 'text.secondary',
                            fontStyle: 'italic',
                          }}
                        >
                          {item.quantity?.value}{' '}
                          {item.quantity.volume === 'noOfItems' ? '' : item.quantity.volume}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ py: 3, px: 16, color: 'text.secondary' }} align="center">
              No ingredients available
            </Typography>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Comment Section */}
          <form onSubmit={formik.handleSubmit}>
            <Accordion sx={{ width: '100%', backgroundColor: '#f4f6f8', }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography variant="overline1" >
                  Comment Section
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
              
                <TYTextField
                  name="comment"
                  label="Enter comment"
                  formik={formik}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 120 }}
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    Add Comment
                  </Button>
                </Stack>

                {/* Reply Section */}
                <Typography variant="overline1" sx={{ mt: 3}}>
                  Reply
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: data?.recipeId?.reply ? 'text.primary' : 'text.secondary' }}
                >
                  {data?.recipeId?.reply || 'No reply available.'}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </form>

          <Stack sx={{ mt: 3 }}>
            {data?.recipeStatus && (
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={(event) => handleButtonClick(event, 0, data._id, data.recipeStatus)}
                sx={{ color: (theme) => theme.palette.primary.contrastText }}
              >
                {recipeNameConverted(data.recipeStatus)}
              </LoadingButton>
            )}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewIngredients;
