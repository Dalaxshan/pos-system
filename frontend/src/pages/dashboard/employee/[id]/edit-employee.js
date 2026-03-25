import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Grid2 } from '@mui/material';
import { Seo } from 'src/components/seo';
import useSWRImmutable from 'swr/immutable';
import { useRouter } from 'next/router';
import { CreateEmployeeForm } from 'src/sections/dashboard/employee/create-employee-form';
import { employeeApi } from 'src/api/employee';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  const router = useRouter();
  const employeeId = router.query.id;

  const {
    data: formValues = {},
    isLoading,
    error,
    mutate,
  } = useSWRImmutable(employeeId ? ['get-employee', employeeId] : null, async () => {
    const response = await employeeApi.getEmployeesById(employeeId);
    return response;
  });

  if (isLoading) return <Loading message="Fetching employee details..." />;

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
      <Seo title="Employee list" />

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
