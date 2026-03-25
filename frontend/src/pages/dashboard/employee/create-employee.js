import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Grid2 } from '@mui/material';
import { Seo } from 'src/components/seo';
import { CreateEmployeeForm } from 'src/sections/dashboard/employee/create-employee-form';

const Page = () => {
  return (
    <>
      <Seo title="Create employee form" />

      <Grid2
        sx={{
          border: '1px solid #CECECE',
          borderRadius: '8px',
          p: 3,
          mt: 3,
          mb: 3,
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
        <CreateEmployeeForm
          formValues={null}
          isEditMode={false}
        />
      </Grid2>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
