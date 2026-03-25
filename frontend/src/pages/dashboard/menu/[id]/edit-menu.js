import { CreateMenuForm } from 'src/sections/dashboard/menu/create-menu-form';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Box } from '@mui/material';
import { Seo } from 'src/components/seo';
import useSWRImmutable from 'swr/immutable';
import { useRouter } from 'next/router';
import { menuAPI } from 'src/api/menu';
import { Loading } from 'src/components/loading';

const Page = () => {
  const router = useRouter();

  const menuId = router.query.id;

  const { data: formValues = {}, isLoading } = useSWRImmutable(
    menuId ? ['get-menu', menuId] : null,
    async () => {
      if (!menuId) return null;
      const response = await menuAPI.getMenuById(menuId);
      const fetchedData = response;
      return fetchedData;
    }
  );

  if (isLoading) return <Loading message="Fetching menu details..." />;

  return (
    <>
      <Seo title="Supplier list" />
      <Box
        sx={{
          p: 2,
          m: 1,
        }}
      >
        <CreateMenuForm
          formValues={formValues}
          isEditMode={true}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
