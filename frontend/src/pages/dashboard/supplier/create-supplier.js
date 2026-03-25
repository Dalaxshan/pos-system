import { CreateSupplierForm } from 'src/sections/dashboard/supplier/create-supplier-form';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Grid2 } from '@mui/material';
import { Seo } from 'src/components/seo';

const Page = () => {
  return (
    <>
      <Seo title="Create supplier form" />

      <Grid2
        sx={{
          border: '1px solid #CECECE',
          borderRadius: '8px',
          p: 3,
          my: 3,
          mx: 'auto',
          backgroundColor: '#FFFFFF',
          width: {
            xs: '90%',
            sm: '80%',
            md: '70%',
            lg: '60%',
            xl: '50%',
          },
          height: 'auto',
        }}
      >
        <CreateSupplierForm
          formValues={null}
          isEditMode={false}
        />
      </Grid2>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
