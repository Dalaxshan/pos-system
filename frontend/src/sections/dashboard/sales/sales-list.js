import React, { useState } from 'react';
import { Card, IconButton, Stack, SvgIcon } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Print, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { paths } from 'src/paths';
import { SeverityPill } from 'src/components/severity-pill';
import { formatDateTime } from 'src/utils/format-date-time';
import { formatPrice } from 'src/utils/price-format';
import { DeleteDialog } from 'src/components/delete-dialog';
import { salesOrderApi } from 'src/api/sales';
import toast from 'react-hot-toast';
import Tooltip from '@mui/material/Tooltip';

const SalesList = ({ data, isLoading,mutate }) => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');

  const handleDeleteItem = (id) => {
    setOpen(true);
    setOrderId(id);
  };

  const onDelete = async () => {
    try {
      await salesOrderApi.deleteSaleOrder(orderId);
      mutate();
      toast.success('Order deleted!');
    } catch (error) {
      toast.error(error.message);
    }
    setOpen(false);
  };

 // View tooltip
 const handleRowClick = (params) => {
  if (params.row.serviceStatus === 'pre-order') {
 // const formattedPreOrderDate = formatDateTime(params.row?.preOrderDate);
 const formattedPreOrderDate = new Date(params.row?.preOrderDate).toLocaleDateString();
    const details = `
      Order ID: ${params.row.orderId}\n
      Payment Type: ${params.row.paymentType}
      preOrderDate: ${formattedPreOrderDate}
    `;
    setTooltipContent(details);
  }else{
    setTooltipContent('');
  }
};

  const columns = [
    {
      field: 'orderId',
      headerName: 'ORDER ID',
      flex: 0.6,
    },
    {
      field: 'createdAt',
      headerName: 'ORDERED DATE',
      flex: 0.8,
      valueGetter: (value) => formatDateTime(value),
    },
    {
      field: 'customerId',
      headerName: 'CUSTOMER',
      flex: 0.5,
      minWidth: 120,
      valueGetter: (params)=>params?.customerName || 'Not entered',
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      flex: 0.3,
      
    },
    {
      field: 'grandTotal',
      headerName: 'GRAND TOTAL',
      flex: 0.5,
      minWidth: 150,
      valueGetter: (value) => formatPrice(value),
    },
    {
      field: 'serviceStatus',
      headerName: 'ORDER TYPE',
      flex: 0.5,
    },
    {
      field: 'paymentStatus',
      headerName: 'PAYMENT',
      flex: 0.6,
      renderCell: (params) => (
        <SeverityPill
          color={params.value === 'paid' ? 'success' : 'warning'}
          sx={{ width: '70px' }}
        >
          {params.value === 'paid' ? 'Paid' : 'Unpaid'}
        </SeverityPill>
      ),
    },
    {
      field: 'paymentType',
      headerName: 'TYPE',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <SeverityPill
          color={
            params.value === 'cash'
              ? 'success'
              : params.value === 'card'
                ? 'primary'
                    : 'infor'
          }
          sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '80px' }}
        >
          {params.value === 'cash'
            ? 'Cash'
            : params.value === 'card'
              ? 'Card'
                : 'Other'}
        </SeverityPill>
      ),
    },
    {
      field: '_id',
      headerName: 'ACTION',
      flex: 0.5,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
        >
          
          <IconButton
            component={Link}
            href={paths.dashboard.sales.getSalesReceipt.replace(':id', params.value)}
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
      <Card sx={{ alignContent: 'center' }}>
      <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipContent}</span>}>
      <div style={{ height: '100%', width: '100%' }}>
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
        pageSizeOptions={[5, 10, 25, 100]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        getRowId={(row) => row._id}
        sx={{
          boxShadow: 2,
          '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
          '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#E1E1E1' },
            }}
            onRowClick={handleRowClick}
            />
          </div>
      </Tooltip>
    </Card>

    <DeleteDialog 
    open={open}
    onDelete={onDelete}
    onClose={() => setOpen(false)}
    />

    </>
  );
};

export default SalesList;
