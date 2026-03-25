import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { CreateBranchForm } from 'src/sections/dashboard/dining/create-branch';
import { Grid2 } from '@mui/material';
import useSWRImmutable from 'swr/immutable';
import { employeeApi } from 'src/api/employee';

const Page = () => {
  const { data = [], isLoading } = useSWRImmutable(['admins'], async () => {
    const response = await employeeApi.getAllAdmins();
    return response;
  });

  return (
    <>
      <Seo title="Create Branch form" />

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
        }}
      >
        <CreateBranchForm
          formValues={null}
          isEditMode={false}
          admins={data}
          isLoadingAdmins={isLoading}
        />
      </Grid2>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
