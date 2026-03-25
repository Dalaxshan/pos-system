import { Card, Divider, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { accountAPI } from 'src/api/account';
import { Error } from 'src/components/error';
import { formatDateTime } from 'src/utils/format-date-time';
import useSWR from 'swr';

export const AccountLoginHistory = () => {
  const { data = [], isLoading,error } = useSWR('login-history', async () => {
    const response = await accountAPI.getAllLoginHistory();
    return response;
  });

  if (error) {
    return <Error message={error.message} />;
  }
  
  const columns = [
    {
      field: 'login',
      headerName: 'LOGIN DATE & TIME',
      flex: 0.5,
      minWidth: 150,
      valueGetter: (params) => formatDateTime(params),
    },
    {
      field: 'name',
      headerName: 'EMPLOYEE',
      flex: 0.4,
      minWidth: 50,
    },
    {
      field: 'role',
      headerName: 'ROLE',
      flex: 0.2,
      minWidth: 30,
    },
    {
      field: 'logout',
      headerName: 'LOGOUT DATE & TIME',
      flex: 0.5,
      valueGetter: (params) => (params ? formatDateTime(params) : 'Logged in'),
    },
  ];

  return (
    <>
      <Typography
        variant="h4"
        sx={{ mb: 2 }}
      >
        Login History
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Card>
        <DataGrid
          loading={isLoading}
          autoHeight
          rows={data}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25, 100]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          getRowId={(row) => row._id}
          sx={{
            boxShadow: 2,
            p: 2,
            '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
            '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#E1E1E1' },
          }}
        />
      </Card>
    </>
  );
};
