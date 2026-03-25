import { TabContext, TabPanel } from '@mui/lab';
import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { itemAPI } from 'src/api/item';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { PurchasesItemList } from 'src/sections/dashboard/item/purchase-item.list';
import { SalesItemList } from 'src/sections/dashboard/item/sales-item-list';
import useSWR from 'swr';

const Page = () => {
  const [tabIndex, setTabIndex] = useState('0');

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  //get all purchases
  const {
    data: purchases = [],
    isLoading: purchaseLoading,
    mutate: purchaseMutate,
  } = useSWR(['purchases'], async () => {
    const response = await itemAPI.getAllPurchaseItem();
    return response;
  });

  //get all sales
  const {
    data: sales = [],
    isLoading: salesLoading,
    mutate: salesMutate,
  } = useSWR(['all-sales-items'], async () => {
    const response = await itemAPI.getAllSalesItem();
    return response;
  });

  return (
    <>
      <Seo title="Item List" />
      <Box sx={{ pt: 4 }}>
        <TabContext value={tabIndex}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="Purchase Items Tabs"
              indicatorColor="primary"
              textColor="primary"
              sx={{ minHeight: 'unset', pl: 5 }}
            >
              <Tab
                label="Purchase Items"
                value="0"
                sx={{ paddingTop: 0, paddingBottom: 0 }}
              />
              <Tab
                label="Sales Items"
                value="1"
                sx={{ paddingTop: 0, paddingBottom: 0 }}
              />
            </Tabs>
          </Box>

          <Box>
            {/* Purchase Panel */}
            <TabPanel value="0">
              <PurchasesItemList
                data={purchases}
                mutate={purchaseMutate}
                isLoading={purchaseLoading}
              />
            </TabPanel>

            {/* Sales Panel */}
            <TabPanel value="1">
              <SalesItemList
                data={sales}
                mutate={salesMutate}
                isLoading={salesLoading}
              />
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
