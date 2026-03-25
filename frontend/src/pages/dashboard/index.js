import React from 'react';
import Box from '@mui/material/Box';
import { Grid2 } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { TopSalesItem } from 'src/sections/dashboard/overview/top-sale-item';
import { StockSummary } from 'src/sections/dashboard/overview/stock-summary';
import { ProfitAverage } from 'src/sections/dashboard/overview/profit-average';
import { MostOrderedItem } from 'src/sections/dashboard/overview/most-order-item';
import { OrderPerformance } from 'src/sections/dashboard/overview/order-performance';
import { DailyUpdate } from 'src/sections/dashboard/overview/daily-update';
import { salesOrderApi } from 'src/api/sales';
import useSWRImmutable from 'swr/immutable';
import { Loading } from 'src/components/loading';
import {LatestNotification} from 'src/sections/dashboard/overview/latest-notification'

const Page = () => {
  //most order item
  const { data: mostOrder = [], loading: topSaleLoading } = useSWRImmutable(
    'most-order',
    async () => {
      const response = await salesOrderApi.getTopSales();
      return response?.data || [];
    }
  );
  return (
    <>
      <Seo title="Dashboard" />
      <Box sx={{ p: 2, height: '100vh' }}>
        <Grid2
          container
          spacing={1}
        >
          {/* Left Column */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <DailyUpdate />
              {topSaleLoading ? (
                <Loading message="loadding metrics details" />
              ) : (
                <MostOrderedItem mostOrder={mostOrder} />
              )}
      
              <LatestNotification/>
            </Stack>
          </Grid2>

          {/* Right Column */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
            <ProfitAverage />
              <StockSummary />
            </Stack>
          </Grid2>        
      </Grid2>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
