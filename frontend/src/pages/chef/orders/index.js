import { Box } from '@mui/material';
import { Seo } from 'src/components/seo';

import { Layout as DashboardLayout } from 'src/layouts/chef';
import useSWR from 'swr';
import { salesOrderApi } from 'src/api/sales';
import OrderList from 'src/sections/chef/orders/orders-list';

const Page = () => {
  // Get all sales order list
  const {
    data: orderData = [],
    isLoading,
    mutate,
  } = useSWR(['all-salesList'], async () => {
    const response = await salesOrderApi.getAllSaleOrders();
    return response;
  });

  return (
    <>
      <Seo title="Sales Order list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <OrderList
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
