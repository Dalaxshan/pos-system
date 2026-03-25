import React from 'react';
import Box from '@mui/material/Box';
import { Grid2 } from '@mui/material';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/cashier';
import SellItems from 'src/sections/cashier/sales/sell-items';
import useSWR from 'swr';
import { itemAPI } from 'src/api/item';
import Checkout from 'src/sections/cashier/sales/checkout';

const Page = () => {
  const { data: salesItems = [] } = useSWR(['all-sales-items'], async () => {
    const response = await itemAPI.getAllSalesItem();
    return response;
  });

  return (
    <>
      <Seo title="Dashboard" />
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Grid2
          container
          direction="row"
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Grid2 size={{ xs: 12, md: 9 }}>
            <SellItems sales={salesItems} />
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 3 }}
            sx={{ backgroundColor: '#ffffff', borderRadius: ' 4px' }}
          >
            <Checkout />
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
