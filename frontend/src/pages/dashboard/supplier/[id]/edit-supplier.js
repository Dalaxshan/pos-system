import { CreateSupplierForm } from 'src/sections/dashboard/supplier/create-supplier-form';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Grid2 } from '@mui/material';
import { Seo } from 'src/components/seo';
import { Error } from 'src/components/error';
import { Loading } from 'src/components/loading';
import useSWRImmutable from 'swr/immutable';
import { useRouter } from 'next/router';
import { supplierAPI } from 'src/api/supplier';

const Page = () => {
  const router = useRouter();
  const supplierId = router.query.id;

  const {
    data: formValues = {},
    isLoading,
    error,
    mutate,

  } = useSWRImmutable(supplierId ? ['get-supplier', supplierId] : null, async () => {
    if (!supplierId) return null;
    const response = await supplierAPI.getSupplierById(supplierId);
    return response;
  });

  if (isLoading) return <Loading message="Fetching supplier details..." />;

  if (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'Something went wrong';
    return (
      <Error
        statusCode={statusCode}
        title={errorMessage}
      />
    );
  }

  return (
    <>
      <Seo title="Supplier list" />

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
          formValues={formValues}
          isEditMode={true}
          mutate={mutate}
        />
      </Grid2>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
