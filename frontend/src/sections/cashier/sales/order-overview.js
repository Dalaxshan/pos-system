import { useFormik } from 'formik';
import { Dialog } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { CheckCircleOutline, DeleteSweepOutlined } from '@mui/icons-material';
import { formatPrice } from 'src/utils/price-format';
import { LoadingButton } from '@mui/lab';


const OrderOverview = (props) => {
  const { order, open, handleClose, totalAmount, confirmOrder, cancelOrder } = props;
  const formik = useFormik({
    initialValues: {
      customerName: order?.customerName || '',
      contactNo: order?.contactNo || '',
      serviceStatus: order?.serviceStatus || 'dine-in',
      paymentStatus: order?.paymentStatus || 'unpaid',
    },
    onSubmit: (values, { setSubmitting }) => {
      
      // Set the button as loading (disabling it)
      setSubmitting(true);

      // Call the confirmOrder function and pass the form values
      confirmOrder(values).finally(() => {
        // Ensure to turn off the loading state once done (whether success or failure)
        setSubmitting(false);
      });
    },
  });


  return (
    <Dialog
      open={open}
      // order={order}
      onClose={handleClose}
    >
      <Card>
      <form onSubmit={formik.handleSubmit}>
        <CardHeader
          subheader={<Typography variant="h4">{formatPrice(totalAmount)}</Typography>}
          sx={{ pb: 0 }}
          title={
            <Typography
              variant="overline"
              sx={{
                color: 'text.secondary',
              }}
            >
              Total amount
            </Typography>
          }
        />
        <CardContent>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
            }}
          >
            Check Details
          </Typography>
          <List
            disablePadding
            sx={{ pt: 2 }}
          >
            <ListItem
              disableGutters
              sx={{
                pb: 2,
                pt: 0,
              }}
            >
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
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          width: 8,
                          borderRadius: '50%',
                        }}
                      />
                      <Typography variant="subtitle2">Customer Name</Typography>
                    </Stack>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {order?.customerName || 'Not entered'}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
            <ListItem
              disableGutters
              sx={{
                pb: 2,
                pt: 0,
              }}
            >
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
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          width: 8,
                          borderRadius: '50%',
                        }}
                      />
                      <Typography variant="subtitle2">Contact Number</Typography>
                    </Stack>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {order?.contactNo || 'Not entered'}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
            <ListItem
              disableGutters
              sx={{
                pb: 2,
                pt: 0,
              }}
            >
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
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          width: 8,
                          borderRadius: '50%',
                        }}
                      />
                      <Typography variant="subtitle2">Service Status</Typography>
                    </Stack>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {order?.serviceStatus}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
       
            <ListItem
              disableGutters
              sx={{
                pb: 2,
                pt: 0,
              }}
            >
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
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          width: 8,
                          borderRadius: '50%',
                        }}
                      />
                      <Typography variant="subtitle2">Payment Type</Typography>
                    </Stack>
                    <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'text.secondary',
                        }}
                     
                    >
                      {order?.paymentType}
                    </Typography>
                  </Stack>
                }
              />
              
            </ListItem>
            <ListItem
              disableGutters
              sx={{
                pb: 2,
                pt: 0,
              }}
            >
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
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          width: 8,
                          borderRadius: '50%',
                        }}
                      />
                      <Typography variant="subtitle2">Payment Status</Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: order?.paymentStatus === 'paid' ? 'success.main' : 'warning.main',
                      }}
                      variant="subtitle2"
                    >
                      {order?.paymentStatus}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          </List>
          <Divider />
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={cancelOrder}
              endIcon={
                <SvgIcon>
                  <DeleteSweepOutlined />
                </SvgIcon>
              }
            >
              Cancel Order
            </Button>
            <LoadingButton
              variant="contained"
              color="success"
              loading={formik.isSubmitting}
              type="submit"
              endIcon={
                <SvgIcon>
                  <CheckCircleOutline />
                </SvgIcon>
              }
            >
              Confirm Order
            </LoadingButton>
          </Stack>
        </CardContent>
        </form>
      </Card>
    </Dialog>
  );
};
export default OrderOverview;
