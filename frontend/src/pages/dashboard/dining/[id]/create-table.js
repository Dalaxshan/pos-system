import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Seo } from 'src/components/seo';
import { Grid2 } from '@mui/material';
import { CreateTableForm } from 'src/sections/dashboard/dining/create-table';
import { ListTables } from 'src/sections/dashboard/dining/list-tables';
import { diningAPI } from 'src/api/dining';
import useSWRImmutable from 'swr/immutable';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  const router = useRouter();
  const branchId = router.query.id;

  const {
    data = [],
    error,
    isLoading,
    mutate,
  } = useSWRImmutable(branchId ? ['tables', branchId] : null, async () => {
    const response = await diningAPI.getAllTablesByBranchId(branchId);
    return response;
  });

  if (isLoading) return <Loading message="Fetching tables..." />;

  if (error) {
    return (
      <Error
        statusCode={error.response?.status || 500}
        title={error.message || 'Failed to load tables'}
      />
    );
  }

  return (
    <>
      <Seo title="Manage Branch Tables" />

      <Grid2
        container
        spacing={1}
        sx={{ mt: 3, pl: 3, pr: 2 }}
      >
        <Grid2 size={{ xs: 12, md: 8 }}>
          <ListTables
            data={data}
            mutate={mutate}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <CreateTableForm
            branchId={branchId}
            mutate={mutate}
          />
        </Grid2>
      </Grid2>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
