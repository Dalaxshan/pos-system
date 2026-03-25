import { Box } from '@mui/material';
import { supplierAPI } from 'src/api/supplier';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { SupplierList } from 'src/sections/dashboard/supplier/supplier-list';
import useSWR from 'swr';

const Page = () => {
  const { data = [], isLoading } = useSWR(['all-suppliers'], async () => {
    const response = await supplierAPI.getAllSuppliers();
    return response;
  });

  return (
    <>
      <Seo title="Supplier list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <SupplierList
          data={data}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
