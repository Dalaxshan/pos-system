import React, { useState } from 'react';
import { Box, Card, Button, Avatar, IconButton, Stack } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { DeleteDialog } from 'src/components/delete-dialog';
import { itemAPI } from 'src/api/item';
import toast from 'react-hot-toast';
import { formatPrice } from 'src/utils/price-format';
import { paths } from 'src/paths';

export const PurchasesItemList = ({ data = [], mutate, isLoading }) => {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const router = useRouter();

  const handleDeleteItem = (id) => {
    setOpen(true);
    setItemId(id);
  };

  const onDelete = async () => {
    try {
      await itemAPI.deleteItem(itemId);
      mutate();
      toast.success('Item deleted!');
    } catch (error) {
      toast.error('Failed to delete!');
    }
    setOpen(false);
  };

  const handleCreateItem = () => {
    router.push({
      pathname: paths.dashboard.item.createItem,
      query: { forSale: false },
    });
  };

  // Data grid columns
  const columns = [
    {
      field: 'itemImage',
      headerName: '',
      flex: 0.3,
      sortable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row.itemImage}
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    { field: 'itemId', headerName: 'ITEM ID', flex: 1 },
    {
      field: 'supplierId',
      headerName: 'COMPANY NAME',
      flex: 0.9,
      valueGetter: (params) => params?.companyName,
    },
    { field: 'name', headerName: 'ITEM NAME', flex: 1 },
    {
      field: 'quantity',
      headerName: 'QTY',
      flex: 0.5,
      valueGetter: (params) => `${params.value} ${params.volume !== 'units' ? params.volume : ''}`,
    },
    {
      field: 'netPrice',
      headerName: 'NET PRICE',
      flex: 0.7,
      valueGetter: (params) => formatPrice(params),
    },
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
            href={paths.dashboard.item.editItem.replace(':id', row._id)}
          >
            <Edit color="info" />
          </IconButton>
          <IconButton onClick={() => handleDeleteItem(row._id)}>
            <Delete color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button
          variant="contained"
          onClick={handleCreateItem}
          sx={{ width: 134 }}
        >
          New Item
        </Button>
      </Box>
      <Card>
        <DataGrid
          autoHeight
          loading={isLoading}
          rows={data}
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
