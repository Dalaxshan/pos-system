import { Box } from '@mui/material';
import { itemAPI } from 'src/api/item';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/chef';
import { SalesItemList } from 'src/sections/chef/item/sales-item-list';
import useSWR from 'swr';

const Page = () => {
  const {
    data = [],
    isLoading,
    mutate
  } = useSWR(['all-sales-items'], async () => {
    const response = await itemAPI.getAllSalesItem();
    return response;
  });

  return (
    <>
      <Seo title="Item List" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <SalesItemList
          data={data}
          isLoading={isLoading}
          mutate={mutate}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
