import React from 'react';
import { Box, Card, IconButton, Stack, SvgIcon } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Print, Edit} from '@mui/icons-material';
import Link from 'next/link';
import { paths } from 'src/paths';
import { SeverityPill } from 'src/components/severity-pill';
import { formatDateTime } from 'src/utils/format-date-time';
import { salesOrderApi } from 'src/api/sales';
import toast from 'react-hot-toast';
import { formatPrice } from 'src/utils/price-format';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

const SalesList = ({ data, isLoading, mutate }) => {
  const [tooltipContent, setTooltipContent] = useState('');

  const updatePaymentStatus = async (orderId, status) => {
    try {
      await salesOrderApi.updatePaymentStatus(orderId, status);
      mutate();
      toast.success('Payment status changed successfully');
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const handleStatusChange = (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'unpaid' ? 'paid' : 'unpaid';
    updatePaymentStatus(orderId, nextStatus);
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
      field: 'quantity',
      headerName: 'QTY',
      flex: 0.3,
    },
    {
      field: 'grandTotal',
      headerName: 'GRAND TOTAL',
      flex: 0.3,
      minWidth: 120,
      valueGetter: (value) => formatPrice(value),
    },
 
    {
      field: 'serviceStatus',
      headerName: 'ORDER TYPE',
      flex: 0.5,
    },
    {
      field: 'orderStatus',
      headerName: 'STATUS',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <SeverityPill
          color={
            params.value === 'placed'
              ? 'primary'
              : params.value === 'ongoing'
                ? 'warning'
                : params.value === 'done'
                  ? 'success'
                  : params.value === 'hold'
                    ? 'info'
                    : 'secondary'
          }
          sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '80px' }}
        >
          {params.value === 'placed'
            ? 'Placed'
            : params.value === 'ongoing'
              ? 'Ongoing'
              : params.value === 'hold'
                ? 'Hold'
                : 'Done'}
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
            href={paths.cashier.sales.updateSale.replace(':id', params.value)}
          >
            <SvgIcon>
              <Edit color="info" />
            </SvgIcon>
          </IconButton>
          <IconButton
            component={Link}
            href={paths.cashier.sales.getSalesReceipt.replace(':id', params.value)}
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
            slotProps={{
              toolbar: { showQuickFilter: true },
            }}
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

export default SalesList;
