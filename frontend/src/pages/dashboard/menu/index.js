import { TabContext, TabPanel } from '@mui/lab';
import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { categoryApi } from 'src/api/category';
import { menuAPI } from 'src/api/menu';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import CategoryList from 'src/sections/dashboard/menu/category-list';
import MenuItemList from 'src/sections/dashboard/menu/menu-item-list';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const Page = () => {
  const [tabIndex, setTabIndex] = useState('0');

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  //get all items
  const {
    data: item = [],
    isLoading: itemsLoading,
    mutate: itemMutate,
  } = useSWRImmutable(['menus'], async () => {
    const response = await menuAPI.getAllMenu();
    return response.results;
  });

  //get all categories
  const {
    data: category = [],
    isLoading: categoryIsLoading,
    mutate: categoryMutate,
  } = useSWR(['category'], async () => {
    const response = await categoryApi.getAllCategory();
    return response;
  });

  return (
    <>
      <Seo title="Menu List" />
      <Box sx={{ margin: 2, padding: 2 }}>
        <TabContext value={tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="Menu Tabs"
              centered
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                label="Items"
                value="0"
              />
              <Tab
                label="Categories"
                value="1"
              />
            </Tabs>
          </Box>

          <Box>
            {/* Items Panel */}
            <TabPanel value="0">
              <MenuItemList
                data={item}
                mutate={itemMutate}
                isLoading={itemsLoading}
              />
            </TabPanel>

            {/* Categories Panel */}
            <TabPanel value="1">
              <CategoryList
                data={category}
                categoryMutate={categoryMutate}
                isLoading={categoryIsLoading}
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
