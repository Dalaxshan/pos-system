import { Box } from '@mui/material';
import { employeeApi } from 'src/api/employee';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import EmployeeList from 'src/sections/dashboard/employee/employee-list';
import useSWR from 'swr';

const Page = () => {
  const { data = [], isLoading } = useSWR(['all-employees'], async () => {
    const response = await employeeApi.getAllEmployee();
    return response;
  });

  return (
    <>
      <Seo title="Employee list" />
      <Box sx={{ margin: 1, padding: 2 }}>
        <EmployeeList
          data={data}
          isLoading={isLoading}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
