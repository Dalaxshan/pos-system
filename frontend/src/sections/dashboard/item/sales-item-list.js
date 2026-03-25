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
import CategoryPopover from 'src/pages/dashboard/category/category-popover';
import QrPopOver from 'src/pages/dashboard/qr-code/qr-popover';


export const SalesItemList = ({ data, mutate, isLoading }) => {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [qrAnchorEl, setQrAnchorEl] = useState(null);
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
      toast.error(error.message);
    }
    setOpen(false);
  };

  const handleCreateItem = () => {
    router.push({
      pathname: paths.dashboard.item.createItem,
      query: { forSale: true },
    });
  };

  const handleAnchorClose = () => {
    setAnchorEl(null);
  };

  const handleQrAnchorClose = () => {
    setQrAnchorEl(null);
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
      field: 'categoryId',
      headerName: 'CATEGORY NAME',
      flex: 1,
      valueGetter: (params) => params.name,
    },

    { field: 'name', headerName: 'ITEM NAME', flex: 1 },
    {
      field: 'quantity',
      headerName: 'QTY',
      flex: 0.5,
      valueGetter: (params) => `${params.value} ${params.volume !== 'units' ? params.volume : ''}`,
    },
    {
      field: 'unitPrice',
      headerName: 'UNIT PRICE',
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 1 }}>
        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ width: '154px' }}
          variant="outlined"
        >
          Add Category
        </Button>
        <Button
          variant="contained"
          onClick={(event) => setQrAnchorEl(event.currentTarget)}
        >
          QR Code
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateItem}
          sx={{ width: '134px' }}
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

      <CategoryPopover
        anchorEl={anchorEl}
        handleClose={handleAnchorClose}
        categoryMutate={mutate}
      />

      <QrPopOver
        qrAnchorEl={qrAnchorEl}
        qrHandleClose={handleQrAnchorClose}
      />
      
    </Box>
  );
};
