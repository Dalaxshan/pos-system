import { Box } from '@mui/material';
import { stockApi } from 'src/api/stock';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import StockList from 'src/sections/dashboard/stock/stock-list';
import useSWR from 'swr';

const Page = () => {
  // Get all Stock list
  const {
    data: stockData = [],
    mutate,
    isLoading,
  } = useSWR(['all-stocklist'], async () => {
    const response = await stockApi.getAllStock();
    return response;
  });

  return (
    <>
      <Seo title="Stock Record list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <StockList
          data={stockData}
          mutate={mutate}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
