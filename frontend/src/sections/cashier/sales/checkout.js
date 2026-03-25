import Button from '@mui/material/Button';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useFormik } from 'formik';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { salesOrderApi } from 'src/api/sales';
import { TYCurrencyInput } from 'src/components/ui/ty-currency-input';
import { TYMobileInput } from 'src/components/ui/ty-mobile-input';
import { TYTextField } from 'src/components/ui/ty-textfield';
import * as Yup from 'yup';
import { formatPrice } from 'src/utils/price-format';
import { clearCart, removeItem } from 'src/store/slices/cart';
import { Close } from '@mui/icons-material';
import { paths } from 'src/paths';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddTables from './add-table';
import AddTakeAway from './add-take-away';
import AddPreOrderDates from './add-pre-order-date';
import OrderOverview from './order-overview';
import Image from 'next/image';
import cardImage from '/public/assets/icons/atm-card.webp';
import cashImage from '/public/assets/icons/dollars.webp';

const Checkout = ({ data, mutate }) => {
  const cart = useSelector((state) => state?.cart?.items);
  const user = useSelector((state) => state?.auth?.user);
  const subTotal = useSelector((state) => state?.cart?.subTotal);
  const dispatch = useDispatch();
  const [tableOpen, setTableOpen] = useState(false);
  const [takeAwayOpen, setTakeawayOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [preOrderOpen, setPreOrderOpen] = useState(false);
  const [takeAway, setTakeAway] = useState('');
  const [dining, setDining] = useState('');
  const [order, setOrder] = useState({});
  const [total, setTotalAmount] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  // const [preOrderDate, setPreOrderDate] = useState('');

  const handleTableClose = () => {
    setTableOpen(false);
  };

  const handleTakeawayClose = () => {
    setTakeawayOpen(false);
  };

  const handlePreOrderClose = () => {
    setPreOrderOpen(false);
  };
  const handleCloseItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleOption = (option) => {
    setTakeAway(option);
    setTakeawayOpen(false);
    setPreOrderOpen(false);
  };

  const handleDining = (option) => {
    setDining(option);
    setTableOpen(false);
    setPreOrderOpen(false);
  };

  const handlePreOrder = (date) => {
    formik.setFieldValue('preOrderDate', date);
    setPreOrderOpen(false);
    setTableOpen(false);
  };

  const handleOrderOverview = (data) => {
    setOrder(data);
    setOverviewOpen(true);
  };
  const handleOverviewClose = () => {
    setOverviewOpen(false);
  };

  const confirmOrder = async () => {
    try {
      let createdOrder;

      if (!data) {
        createdOrder = await salesOrderApi.createSaleOrder(order);

        toast.success('Order created!');
        formik.resetForm();
      } else {
        await salesOrderApi.updateSale(data._id, order);
        mutate();
        toast.success('Order updated!');
        createdOrder = data;
      }
      const orderId = createdOrder?._id || data._id;
      window.open(paths.cashier.sales.getSalesReceipt.replace(':id', orderId));

      dispatch(clearCart());
      setOverviewOpen(false);
    } catch (err) {
      toast.error(err.message || 'An error occurred while processing the order');
    }
  };

  const cancelOrder = () => {
    formik.resetForm();
    dispatch(clearCart());
    setOverviewOpen(false);
  };

  const initialValues = {
    customerName: data?.customerId?.customerName ?? '',
    contactNo: data?.customerId?.contactNo ?? '',
    discount: data?.discount ?? 0,
    serviceStatus: data?.serviceStatus ?? '',
    paymentStatus: data?.paymentStatus ?? 'paid',
    tableId: data?.tableId?._id ?? null,
    paymentType: data?.paymentType ?? 'cash',
    preOrderDate: data?.preOrderDate ?? '',
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().min(3).max(80),
    contactNo: Yup.string().optional(),
    serviceStatus: Yup.string().required('Service status is required'),
    paymentStatus: Yup.string().required('Payment status is required'),
    discount: Yup.number()
      .optional()
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount cannot be more than 100%'),
    paymentType: Yup.string().required('Payment type is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const reqBody = {
        items: cart.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
          customizations: item.customizations.map((customization) => ({
            variation: customization.variation,
            price: customization.price,
          })),
          totalAmount: item.totalAmount,
          note: item.note || '',
        })),
        employeeId: user.id,
        customerName: values.customerName,
        contactNo: values.contactNo,
        discount: values.discount || 0,
        serviceStatus: formik.values.serviceStatus,
        tableId: formik.values.serviceStatus === 'dine-in' && dining ? dining._id : values.tableId,
        paymentStatus: formik.values.serviceStatus === 'take-away' ? 'paid' : 'unpaid',
        preOrderDate:
          formik.values.serviceStatus === 'pre-order' ? formik.values.preOrderDate : null,
        paymentType: values.paymentType,
      };

      if (formik.values.serviceStatus) {
        handleOrderOverview(reqBody);
      } else {
        toast.error('Please select service status option.');
      }
    },
  });

  const calculateTotal = useCallback(() => {
    const discountAmount = (parseFloat(subTotal) * parseFloat(formik.values.discount)) / 100;
    const serviceCharge =
      formik.values.serviceStatus === 'dine-in' ? parseFloat(subTotal) * 0.1 : 0;
    const totalAmount = (parseFloat(subTotal) - discountAmount + serviceCharge).toFixed(2);

    return { totalAmount, serviceCharge };
  }, [subTotal, formik.values.discount, formik.values.serviceStatus]);

  useEffect(() => {
    const { totalAmount, serviceCharge } = calculateTotal();
    setTotalAmount(totalAmount);
    setServiceCharge(serviceCharge);
  }, [calculateTotal]);

  return (
    <>
      <Grid2
        container
        direction="column"
        sx={{ justifyContent: 'space-between', minHeight: '100vh' }}
      >
        {/* Order List */}
        <Grid2
          size={12}
          sx={{ flexGrow: 1, pl: 1 }}
        >
          <Typography
            variant="h6"
            sx={{ pt: 3, pb: 0 }}
          >
            YOUR ORDER
          </Typography>

          <Box
            sx={{
              maxHeight: '227px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                width: '1px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            <Stack
              spacing={1}
              sx={{ pr: 1, pt: 1.5 }}
            >
              {cart?.map((item,index) => (
                <Card
                  key={index}
                  sx={{ border: '1px solid #e0e0e0', borderRadius: '10px' }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'center', p: 1 }}
                  >
                    <Box sx={{ flexGrow: 1, p: 0.1 }}>
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
                      >
                        <Typography variant="overline1">{item.name}</Typography>
                        <Box sx={{ height: '1px' }}>
                          <IconButton onClick={() => handleCloseItem(item.totalAmount)}>
                            <Close sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Box>
                      </Stack>

                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body3">{formatPrice(item.totalAmount)}</Typography>
                        <Typography
                          variant="body3"
                          sx={{
                            mx: 1,
                          }}
                        >
                          x
                        </Typography>
                        <Typography variant="body3">{item.quantity}</Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            flexGrow: 1,
                          }}
                        >
                          <Typography variant="subTitleItem2">
                            {formatPrice(item.totalAmount * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Box>
        </Grid2>

        {/* Footer */}
        <Grid2
          size={12}
          sx={{ px: 1 }}
        >
          <Stack sx={{ flexGrow: 2 }}>
            <Box>
              <form onSubmit={formik.handleSubmit}>
                <Accordion
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    '& .MuiAccordionDetails-root': {
                      position: 'absolute',
                      bottom: '60%',
                      left: 0,
                      right: 0,
                      zIndex: 2,
                      backgroundColor: 'white',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography>Other details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack
                      direction="column"
                      spacing={1}
                    >
                      <TYCurrencyInput
                        formik={formik}
                        name="discount"
                        label="Order discount"
                        suffix="%"
                        onChange={(event) => {
                          formik.setFieldValue('discount', parseFloat(event.target.value));
                        }}
                      />

                      <TYTextField
                        formik={formik}
                        name="customerName"
                        label="Customer Name"
                      />
                      <TYMobileInput
                        formik={formik}
                        name="contactNo"
                        label="Mobile Number"
                        autoComplete="tel"
                      />
                    </Stack>
                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ mt: 1 }}
                    >
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="serviceStatus"
                          name="serviceStatus"
                          value={formik.values.serviceStatus}
                          onChange={(event) => {
                            formik.setFieldValue('serviceStatus', event.target.value);
                            if (event.target.value === 'dine-in') {
                              setTableOpen(true);
                            } else if (event.target.value === 'take-away') {
                              setTakeawayOpen(true);
                            } else if (event.target.value === 'pre-order') {
                              setPreOrderOpen(true);
                            }
                          }}
                        >
                          <FormControlLabel
                            value="dine-in"
                            control={<Radio />}
                            label="Dine In"
                          />
                          <FormControlLabel
                            value="take-away"
                            control={<Radio />}
                            label="Take Away"
                          />
                          <FormControlLabel
                            value="pre-order"
                            control={<Radio />}
                            label="Pre Order"
                          />
                        </RadioGroup>
                      </FormControl>

                      {/**payment type */}
                      <Typography
                        variant="overline1"
                        sx={{ pt: 2 }}
                      >
                        Payment Type
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="paymentType"
                          name="paymentType"
                          value={formik.values.paymentType}
                          onChange={(event) => {
                            formik.setFieldValue('paymentType', event.target.value);
                          }}
                        >
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                              <Image
                                src={cardImage}
                                alt="Card"
                                width="34"
                                height="34"
                              />
                            }
                          />
                          <FormControlLabel
                            value="cash"
                            control={<Radio />}
                            label={
                              <Image
                                src={cashImage}
                                alt="Cash"
                                width="44"
                                height="43"
                              />
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Orders total */}
                <Box
                  sx={{
                    backgroundColor: '#F3F3F3',
                    borderRadius: '8px',
                    padding: 1,
                    mt: 2,
                    mb: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body3">Sub Total</Typography>
                    <Typography>{formatPrice(subTotal || 0)}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography sx={{ fontSize: '13px' }}>Discount</Typography>
                    <Typography>{formik.values.discount || 0}%</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography sx={{ fontSize: '13px' }}>Service Charge(10%)</Typography>
                    <Typography>{formatPrice(serviceCharge || 0)}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">{formatPrice(total || 0)}</Typography>
                  </Stack>
                </Box>

                <Box sx={{ mt: 'auto', mb: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={formik.isSubmitting}
                    fullWidth
                  >
                    {data ? 'UPDATE ORDER' : 'PLACE ORDER'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Stack>
        </Grid2>
      </Grid2>

      <AddTables
        open={tableOpen}
        handleClose={handleTableClose}
        handleDining={handleDining}
      />

      <AddTakeAway
        open={takeAwayOpen}
        handleClose={handleTakeawayClose}
        handleOption={handleOption}
      />
      <OrderOverview
        order={order}
        open={overviewOpen}
        handleClose={handleOverviewClose}
        totalAmount={total}
        confirmOrder={confirmOrder}
        cancelOrder={cancelOrder}
      />
      <AddPreOrderDates
        open={preOrderOpen}
        handleClose={handlePreOrderClose}
        onDateSelect={handlePreOrder}
      />
    </>
  );
};

export default Checkout;
