import { Card, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { accountAPI } from 'src/api/account';
import useSWR from 'swr';

export const TopSalesItem = () => {
  const { data = [] } = useSWR(['top-sales'], async () => {
    const response = await accountAPI.getTopSales();
    return response;
  });

  // Sort data by quantity in descending order
  const sortedData = [...data].sort((a, b) => b.quantity - a.quantity);

  const columns = [
    {
      field: 'itemNo',
      headerName: 'ITEM ID',
      flex: 0.5,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pt: 2 }}
        >
          {row?.itemId}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'ITEM NAME',
      flex: 0.5,
      minWidth: 50,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pt: 2 }}
        >
          {row?.itemName}
        </Typography>
      ),
    },
    {
      field: 'sales',
      headerName: 'TOTAL SALESl',
      flex: 0.3,
      minWidth: 30,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pt: 2 }}
        >
          {row?.quantity}
        </Typography>
      ),
    },
  ];

  return (
    <Card>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>TOP SALE ITEM -</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'text.secondary' }}>
          (Monthly)
        </Typography>
      </Stack>
      <DataGrid
        sx={{
          boxShadow: 2,
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
          p: 1,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#E1E1E1',
          },
        }}
        rowHeight={40}
        rows={sortedData}
        columns={columns.map((col) => ({
          ...col,
          headerAlign: 'left',
          align: 'left',
        }))}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 3,
            },
          },
        }}
        pageSizeOptions={[3, 6, 9]}
        slots={{ toolbar: GridToolbar }}
        getRowId={(row) => row.itemId}
      />
    </Card>
  );
};
