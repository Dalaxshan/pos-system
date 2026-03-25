import React, { useState } from 'react';
import { Card, Button, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { Delete, Edit, Add } from '@mui/icons-material';
import Link from 'next/link';
import { DeleteDialog } from 'src/components/delete-dialog';
import { diningAPI } from 'src/api/dining';
import toast from 'react-hot-toast';
import { paths } from 'src/paths';

export const ListBranch = ({ data = [], isLoading }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [branchId, setBranchId] = useState(null);

  const handleDeleteBranch = (id) => {
    setOpen(true);
    setBranchId(id);
  };

  const onDelete = async () => {
    try {
      await diningAPI.deleteBranch(branchId);
      toast.success('Branch deleted!');
      router.push(paths.dashboard.dining.index);
    } catch (error) {
      toast.error('Failed to delete!');
    }
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    { field: 'branchId', headerName: 'BRANCH ID', flex: 0.5 },
    { field: 'branchName', headerName: 'BRANCH NAME', flex: 0.5 },
    { field: 'address', headerName: 'ADDRESS', flex: 0.5 },
    { field: 'contactNo', headerName: 'CONTACT', flex: 0.5 },
    { field: 'email', headerName: 'EMAIL', flex: 0.5 },
    { field: 'employeeId', headerName: 'MANAGER', flex: 0.5, valueGetter: (params) => params?.name },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          spacing={1}
        >
          <Tooltip
            title="Add Tables"
            arrow
          >
            <IconButton
              component={Link}
              href={paths.dashboard.dining.createTable.replace(':id', row._id)}
              aria-label="add"
            >
              <Add color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Edit Branch"
            arrow
          >
            <IconButton
              component={Link}
              href={`${paths.dashboard.dining.index}/${row._id}/edit-branch`}
              aria-label="edit"
            >
              <Edit color="info" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Delete Branch"
            arrow
          >
            <IconButton
              onClick={() => handleDeleteBranch(row._id)}
              aria-label="delete"
            >
              <Delete color="error" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pb={2}
      >
        <Typography variant="h4">Branches</Typography>
        <Button
          variant="contained"
          component={Link}
          href={paths.dashboard.dining.createBranch}
        >
          Add New Branch
        </Button>
      </Stack>

      <Card>
        <DataGrid
          autoHeight
          loading={isLoading}
          rows={data}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 100]}
          rowHeight={60}
          getRowId={(row) => row._id}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#E1E1E1',
            },
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
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
