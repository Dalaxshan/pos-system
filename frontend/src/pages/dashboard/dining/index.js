import { Container } from '@mui/material';
import { diningAPI } from 'src/api/dining';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { ListBranch } from 'src/sections/dashboard/dining/list-branch';
import useSWR from 'swr';

const Page = () => {
  const { data = [], isLoading } = useSWR(['branches'], async () => {
    const response = await diningAPI.getAllBranches();
    return response;
  });

  return (
    <>
      <Seo title="Supplier list" />

      <Container
        maxWidth="xl"
        sx={{ my: 3 }}
      >
        <ListBranch
          data={data}
          isLoading={isLoading}
        />
      </Container>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
