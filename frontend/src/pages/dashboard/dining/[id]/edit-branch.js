import { CreateBranchForm } from 'src/sections/dashboard/dining/create-branch';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Grid2 } from '@mui/material';
import { Seo } from 'src/components/seo';
import useSWRImmutable from 'swr/immutable';
import { useRouter } from 'next/router';
import { diningAPI } from 'src/api/dining';
import { Loading } from 'src/components/loading';
import { employeeApi } from 'src/api/employee';

const Page = () => {
  const router = useRouter();

  const branchId = router.query.id;

  const { data: formValues = {}, isLoading } = useSWRImmutable(
    branchId ? ['get-branch-by-id', branchId] : null,
    async () => {
      if (!branchId) return null;

      const response = await diningAPI.getBranchById(branchId);

      return response;
    }
  );

  const { data = [], isLoading: isLoadingAdmins } = useSWRImmutable(['admins'], async () => {
    const response = await employeeApi.getAllAdmins();
    return response;
  });

  if (isLoading) return <Loading message="Fetching branch  details..." />;

  return (
    <>
      <Seo title="Branch list" />

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
          height: {
            xs: 'auto',
            sm: 'auto',
            md: 'auto',
            lg: 'auto',
            xl: 'auto',
          },
        }}
      >
        <CreateBranchForm
          formValues={formValues}
          isEditMode={true}
          admins={data}
          isLoadingAdmins={isLoadingAdmins}
        />
      </Grid2>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
