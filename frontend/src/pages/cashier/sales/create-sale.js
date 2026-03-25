import { Layout as DashboardLayout } from 'src/layouts/cashier';
import { Seo } from 'src/components/seo';
import { Box, Container } from '@mui/material';

import { CreateSaleOrderForm } from 'src/sections/cashier/sales/create-sale-order-form';
import { itemAPI } from 'src/api/item';
import { customerAPI } from 'src/api/customer';
import useSWR from 'swr';

const Page = () => {
  //All menu list
  const { data: salesItems = [] } = useSWR(['all-sales-items'], async () => {
    const response = await itemAPI.getAllSalesItem();
    return response;
  });

  //all customer
  const { data: customerList = [] } = useSWR(['all-custoemr'], async () => {
    const response = await customerAPI.getAllCustomer();
    return response;
  });

  return (
    <>
      <Seo title="Create item form" />
      <Container>
        <Box sx={{ pt: 2, pb: 2, ml: 12 }}>
          <CreateSaleOrderForm
            salesItems={salesItems}
            customerList={customerList}
          />
        </Box>
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
