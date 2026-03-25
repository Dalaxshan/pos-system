import { Layout as DashboardLayout } from 'src/layouts/cashier';
import { Seo } from 'src/components/seo';
import { Box, Grid2 } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import { editSaleOrder } from 'src/store/thunks/cart';
import SellItems from 'src/sections/cashier/sales/sell-items';
import Checkout from 'src/sections/cashier/sales/checkout';
import { itemAPI } from 'src/api/item';
import { Error } from 'src/components/error';
import { Loading } from 'src/components/loading';

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const saleId = router.query.id;

  const {
    data: saleData,
    error: saleError,
    mutate,
    isLoading,
  } = useSWRImmutable(
    saleId ? ['sale-details', saleId] : null,
    async () => {
      const saleOrderData = await dispatch(editSaleOrder(saleId)).unwrap();
      return saleOrderData;
    },
    { revalidateOnMount: true }
  );

  const { data: salesItems = [] } = useSWRImmutable(['all-sales-items'], async () => {
    const response = await itemAPI.getAllSalesItem();
    return response;
  });
  if (isLoading) return <Loading message="Loading order details..." />;
  if (saleError)
    <Error
      statusCode={saleError?.statusCode || 500}
      title="Error fetching order details"
    />;

  return (
    <>
      <Seo title="Update sale form" />
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Grid2
          container
          direction="row"
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid2 size={{ xs: 12, md: 9 }}>
            <SellItems sales={salesItems} />
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 3 }}
            sx={{ backgroundColor: '#ffffff', borderRadius: '4px' }}
          >
            <Checkout data={saleData} mutate={mutate} />
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
