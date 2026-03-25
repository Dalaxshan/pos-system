import React, { useState } from 'react';
import { Box, Card, Button, Stack, IconButton, Typography, SvgIcon } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Delete, Edit, Print } from '@mui/icons-material';
import Link from 'next/link';
import { formatDate } from 'src/utils/form-date';
import { purchaseOrderApi } from 'src/api/purchase';
import { DeleteDialog } from 'src/components/delete-dialog';
import toast from 'react-hot-toast';
import { SeverityPill } from 'src/components/severity-pill';
import { paths } from 'src/paths';

const PurchaseList = ({ data, isLoading, mutate }) => {
  const [orderId, setOrderId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDeleteOrder = (id) => {
    setOpen(true);
    setOrderId(id);
  };

  const onDelete = async () => {
    try {
      await purchaseOrderApi.deletePurchase(orderId);
      mutate();
      toast.success('Purchase Order deleted!');
    } catch (error) {
      toast.error(error.message);
    }
    setOpen(false);
  };

  const columns = [
    {
      field: 'orderId',
      headerName: 'ORDER ID',
      flex: 0.8,
    },
    {
      field: 'createdAt',
      headerName: 'ORDERED DATE',
      flex: 0.8,
      valueGetter: (params) => formatDate(params),
    },
    {
      field: 'supplierId',
      headerName: 'COMPANY NAME',
      flex: 0.8,
      valueGetter: (params) => params?.companyName,
    },
    {
      field: 'netPrice',
      headerName: 'NET PRICE (LKR)',
      flex: 0.8,
    },
    {
      field: 'paymentStatus',
      headerName: 'PAYMENT',

      flex: 0.8,
      renderCell: (params) => (
        <SeverityPill
          color={params.value ? 'success' : 'secondary'}
          sx={{ width: '90px' }}
        >
          {params.value ? 'Paid' : 'Unpaid'}
        </SeverityPill>
      ),
    },
    {
      field: 'status',
      headerName: 'DELIVERY STATUS',
      flex: 0.7,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'delivered' ? '#81B7F1' : '#B9B9B9',
            width: '90px',
            borderRadius: '5px',
            color: 'black',
            mt: 2,
          }}
        >
          <Typography sx={{ textAlign: 'center' }}>
            {params.value === 'delivered' ? 'Delivered' : 'Pending'}
          </Typography>
        </Box>
      ),
    },
    {
      field: '_id',
      headerName: 'ACTION',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center' }}
        >
          <IconButton
            component={Link}
            href={paths.dashboard.purchase.editPurchase.replace(':id', row._id)}
          >
            <SvgIcon>
              <Edit sx={{ color: '#01D7F5' }} />
            </SvgIcon>
          </IconButton>
          <IconButton onClick={() => handleDeleteOrder(row._id)}>
            <SvgIcon>
              <Delete sx={{ color: '#FF5151' }} />
            </SvgIcon>
          </IconButton>
          <IconButton
            component={Link}
            href={paths.dashboard.purchase.purchaseOrder.replace(':id', row._id)}
          >
            <SvgIcon>
              <Print />
            </SvgIcon>
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button
          LinkComponent={Link}
          variant="contained"
          href={paths.dashboard.purchase.createOrder}
        >
          New Purchase Order
        </Button>
      </Box>
      <Card>
        <DataGrid
          autoHeight
          loading={isLoading}
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 200]}
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
    </>
  );
};

export default PurchaseList;
