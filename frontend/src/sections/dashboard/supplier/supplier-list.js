import React, { useState } from 'react';
import { Box, Card, Button, Avatar, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { DeleteDialog } from 'src/components/delete-dialog';
import { supplierAPI } from 'src/api/supplier';
import toast from 'react-hot-toast';

export const SupplierList = ({ data = [], isLoading }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [supId, setSupId] = useState();

  const handleDeleteSupplier = (supplierId) => {
    setOpen(true);
    setSupId(supplierId);
  };

  const onDelete = async () => {
    try {
      await supplierAPI.deleteSupplier(supId);
      toast.success('Supplier deleted!');
      router.push(paths.dashboard.supplier.index);
    } catch (error) {
      toast.error('Failed to delete!');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: 'logoUrl',
      headerName: '',
      flex: 0.3,
      sortable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row?.logoUrl}
          sx={{ width: 45, height: 45 }}
        />
      ),
    },
    {
      field: 'companyName',
      headerName: 'COMPANY NAME',
      flex: 0.9,
    },
    {
      field: 'supplierId',
      headerName: 'SUPPLIER ID',
      flex: 1,
    },
    {
      field: 'contactNumber',
      headerName: 'Contact No',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton
            component={Link}
            href={paths.dashboard.supplier.editSupplier.replace(':id', row._id)}
          >
            <Edit color="info" />
          </IconButton>
          <IconButton onClick={() => handleDeleteSupplier(row._id)}>
            <Delete color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button
          LinkComponent={Link}
          variant="contained"
          href={paths.dashboard.supplier.createSupplier}
          sx={{ width: 134 }}
        >
          New Supplier
        </Button>
      </Box>

      <Card>
        <DataGrid
          autoHeight
          loading={isLoading}
          rowHeight={60}
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
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.email}
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
        />
      </Card>

      <DeleteDialog
        open={open}
        onDelete={onDelete}
        onClose={handleClose}
      />
    </>
  );
};

export default SupplierList;
