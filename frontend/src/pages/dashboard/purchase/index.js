import { Box } from '@mui/material';
import { purchaseOrderApi } from 'src/api/purchase';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import PurchaseList from 'src/sections/dashboard/purchase/purchase-list';
import useSWR from 'swr';

const Page = () => {
  // Get all Purchase orders list
  const {
    data: orderData = [],
    mutate,
    isLoading,
  } = useSWR(['all-orderlist'], async () => {
    const response = await purchaseOrderApi.getAllPurchaseOrders();
    return response;
  });

  return (
    <>
      <Seo title="Purchase Order list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <PurchaseList
          data={orderData}
          isLoading={isLoading}
          mutate={mutate}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
