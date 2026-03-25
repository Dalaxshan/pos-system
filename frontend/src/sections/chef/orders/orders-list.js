import React, { useState } from 'react';
import { Card, IconButton, Stack, SvgIcon, Tooltip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Print } from '@mui/icons-material';
import Link from 'next/link';
import { paths } from 'src/paths';
import { SeverityPill } from 'src/components/severity-pill';
import { formatDateTime } from 'src/utils/format-date-time';
import { salesOrderApi } from 'src/api/sales';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';

const OrderList = ({ data, isLoading, mutate }) => {
  const [tooltipContent, setTooltipContent] = useState('');

  const [orderStatuses, setOrderStatuses] = useState(
    data?.map((order) => order.orderStatus || 'placed') || []
  );

  const updateOrderStatus = async (orderId, status) => {
    try {
      await salesOrderApi.updateOrderStatus(orderId, status);
      mutate();
      toast.success('Order status changed successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleStatusChange = (index, orderId, currentStatus) => {
    const nextStatus =
      currentStatus === 'placed'
        ? 'ongoing'
        : currentStatus === 'ongoing'
          ? 'done'
          : currentStatus === 'done'
            ? 'hold'
            : 'placed';

    const updatedStatuses = [...orderStatuses];
    updatedStatuses[index] = nextStatus;
    setOrderStatuses(updatedStatuses);
    updateOrderStatus(orderId, nextStatus);
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
      valueGetter: (value) => {
        return formatDateTime(value);
      },
    },
    {
      field: 'quantity',
      headerName: 'QTY',
      flex: 0.3,
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
      field: 'orderStatus',
      headerName: 'ORDER STATUS',
      flex: 0.7,
      renderCell: (params) => {
        const currentStatus = params.value;
        const color =
          currentStatus === 'placed'
            ? 'primary'
            : currentStatus === 'ongoing'
              ? 'info'
              : currentStatus === 'hold'
                ? 'error'
                : 'success';

        return (
          <Tooltip
            title="Update the order status"
            arrow
          >
            <LoadingButton
              variant="contained"
              color={color}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(params.id, params.row._id, currentStatus);
              }}
              sx={{
                borderRadius: '10px',
                width: '100px',
                height: '30px',
                color: (theme) => theme.palette[color].contrastText,
              }}
            >
              {currentStatus}
            </LoadingButton>
          </Tooltip>
        );
      },
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
            href={paths.chef.orders.orderReceipt.replace(':id', params.row._id)}
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
    <Card sx={{ alignContent: 'center' }}>
      <Tooltip
        title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipContent}</span>}
      >
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
  );
};

export default OrderList;
