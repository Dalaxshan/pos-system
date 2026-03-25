import React, { useState } from 'react';
import { Box, Card, Typography, Button, Stack, SvgIcon, IconButton, Avatar } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { paths } from 'src/paths';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { CreateMenuForm } from './create-menu-form';

export const MenuItemList = (props) => {
  const { data, mutate } = props;
  const [open, setOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(price);
  };

  // const handleDeleteMenu = (menuId) => {
  //   setOpen(true);
  //   setMenuId(menuId);
  // };

  // delete item
  // const onDelete = async () => {
  //   try {
  //     await menuAPI.deleteMenu(menuId);
  //     toast.success('Menu deleted!');
  //     router.push(paths.dashboard.menu.index);
  //   } catch (error) {
  //     toast.error('Failed to delete!');
  //   }
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: 'coverUrl',
      headerName: '',

      minWidth: 10,
      renderCell: ({ row }) => (
        <Box>
          <Avatar
            src={row.coverUrl}
            style={{ width: '50px', height: '50px' }}
          />
        </Box>
      ),
    },
    {
      field: 'menuListId',
      headerName: 'Menu item id',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.menuId}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ textAlign: 'left' }}
        >
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },

    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.categoryId?.categoryName}
        </Typography>
      ),
    },
    {
      field: 'menuItem',
      headerName: 'Item',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.menuItem}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.quantity}
        </Typography>
      ),
    },

    {
      field: 'unitPrice',
      headerName: 'Unit price',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {formatPrice(row.unitPrice)}
        </Typography>
      ),
    },

    {
      field: 'offer',
      headerName: 'Offer(%)',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.offer}
        </Typography>
      ),
    },

    {
      field: '_id',
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            component={Link}
            href={`${paths.dashboard.menu.index}/${params.row._id}/edit-menu`}
          >
            <SvgIcon
              component={Edit}
              sx={{ color: '#01D7F5' }}
            />
          </IconButton>
          <IconButton>
            <SvgIcon
              component={Delete}
              sx={{ color: '#FF5151' }}
            />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderRadius: '8px' }}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ width: '134px' }}
          >
            New Menu
          </Button>
        </Box>

        <Card>
          <DataGrid
            sx={{
              boxShadow: 2,
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              pt: 1,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#E1E1E1',
              },
            }}
            rowHeight={75}
            rows={data}
            columns={columns.map((col) => ({
              ...col,
              headerAlign: 'center',
              align: 'center',
            }))}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        </Card>
      </Box>

      <CreateMenuForm
        open={open}
        onClose={handleClose}
        mutate={mutate}
        categoryList={data}
      />
    </>
  );
};

export default MenuItemList;
