import { Box } from '@mui/material';
import { Seo } from 'src/components/seo';

import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import useSWR from 'swr';
import { salesOrderApi } from 'src/api/sales';
import SalesList from 'src/sections/dashboard/sales/sales-list';

const Page = () => {
  // Get all sales order list
  const { data: orderData = [], isLoading,mutate } = useSWR(['all-salesList'], async () => {
    const response = await salesOrderApi.getAllSaleOrders();
    return response;
  });

  return (
    <>
      <Seo title="Sales Order list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <SalesList
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
