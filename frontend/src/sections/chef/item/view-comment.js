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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
  } from '@mui/material';

  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import { LoadingButton } from '@mui/lab';
  import toast from 'react-hot-toast';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { TYTextField } from 'src/components/ui/ty-textfield';
  import useSWRImmutable from 'swr/immutable';
  import { recipeAPI } from 'src/api/recipe';
  
  const ViewComment = (props) => {
    const { open, handleClose, recipeId } = props;
  
    // Fetch recipe by recipeId
    const { data, isLoading, mutate } = useSWRImmutable(
      recipeId ? ['recipe', recipeId] : null,
      async () => {
        const response = await recipeAPI.getRecipeById(recipeId);
        return response;
      }
    );

    const initialValues = {
      reply: data?.reply || '',
    };
  
    // Comment form submission
    const formik = useFormik({
      initialValues,
      enableReinitialize: true,
      validationSchema: Yup.object({
        reply: Yup.string().required('Reply is required'),
      }),
  
      onSubmit: async (values) => {
        try {
          await recipeAPI.editReply(recipeId, { reply: values.reply });
          toast.success('Reply updated successfully');
          mutate();
        } catch (error) {
          console.error('Error updating reply:', error);
          toast.error('Failed to add reply');
        }
      },
    });
  
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography
            variant="h5"
            align="center"
            sx={{ pt: 2, fontWeight: 'bold', color: 'primary.main' }}
          >
            View Comment
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
            {data?.ingredients && data?.ingredients.length > 0 ? (
              <List disablePadding sx={{ pt: 2 }}>
                {data?.ingredients.map((item) => (
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
            <Divider />
            {/* Comment Section */}   

             
             {/* Comment and Reply Section */}
          <form onSubmit={formik.handleSubmit}>
            <Accordion sx={{ width: '100%', backgroundColor: '#f4f6f8', mt: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography variant="overline1" >
                  Comment
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body4"
                  sx={{
                    color: data?.comment ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {data?.comment || 'No comment available'}
                </Typography>
                <Divider sx={{ my: 1 }} />
                
                <TYTextField
                  name="reply"
                  label="Add your reply here..."
                  formik={formik}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  sx={{
                    mt: 2,
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={formik.isSubmitting}
                    sx={{ minWidth: '100px' }}
                  >
                    Reply
                  </LoadingButton>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </form>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ViewComment;
  