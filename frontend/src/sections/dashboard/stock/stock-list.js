import React, { useState } from 'react';
import { Box, Card, Button, IconButton, Stack } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { DeleteDialog } from 'src/components/delete-dialog';
import { stockApi } from 'src/api/stock';
import toast from 'react-hot-toast';
import { paths } from 'src/paths';
import { formatDate } from 'src/utils/form-date';

const StockList = ({ data, mutate, isLoading }) => {
  const [open, setOpen] = useState(false);
  const [stockId, setStockId] = useState(null);

  const handleDeleteStock = (id) => {
    setOpen(true);
    setStockId(id);
  };

  const onDelete = async () => {
    try {
      await stockApi.deleteStock(stockId);
      mutate();
      toast.success('Stock Record deleted!');
    } catch (error) {
      toast.error(error.message);
    }
    setOpen(false);
  };

  const columns = [
    { field: 'stockId', headerName: 'STOCK ID', flex: 0.6 },
    {
      field: 'createdAt',
      headerName: 'CREATED DATE',
      flex: 0.6,
      valueGetter: (value) => formatDate(value),
    },
    {
      field: 'salesItem',
      headerName: 'SALES ITEM ID',
      flex: 1,
      valueGetter: (value) => value?.salesItemId,
    },
    {
      field: 'employeeId',
      headerName: 'CREATED BY',
      flex: 1,
      valueGetter: (value) => value?.name,
    },
    { field: 'comments', headerName: 'COMMENTS', flex: 1 },
    { field: 'totQty', headerName: 'QTY', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          spacing={1}
        >
          <IconButton
            component={Link}
            href={paths.dashboard.stock.editStock.replace(':id', row._id)}
          >
            <Edit color="info" />
          </IconButton>
          <IconButton onClick={() => handleDeleteStock(row._id)}>
            <Delete color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderRadius: '8px' }}>
        <Button
          variant="contained"
          LinkComponent={Link}
          href={paths.dashboard.stock.createStock}
        >
          New Stock Record
        </Button>
      </Box>

      <Card>
        <DataGrid
          autoHeight
          loading={isLoading}
          rows={data || []}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          getRowId={(row) => row._id}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
            '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
            pt: 1,
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#E1E1E1' },
          }}
        />
      </Card>

      <DeleteDialog
        open={open}
        onDelete={onDelete}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};

export default StockList;
