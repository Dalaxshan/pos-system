import React, { useState } from 'react';
import { Box, Card, Button, Avatar, IconButton, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { DeleteDialog } from 'src/components/delete-dialog';
import { employeeApi } from 'src/api/employee';
import toast from 'react-hot-toast';
import { paths } from 'src/paths';

export const EmployeeList = ({ data, isLoading }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const handleDeleteEmployee = (id) => {
    setEmployeeId(id);
    setOpen(true);
  };

  const onDelete = async () => {
    try {
      await employeeApi.deleteEmployee(employeeId);
      toast.success('Employee deleted!');
      router.push(paths.dashboard.employee.index);
    } catch (error) {
      toast.error('Failed to delete!');
    }
    setOpen(false);
  };

  const columns = [
    {
      field: 'profilePhotoUrl',
      headerName: '',
      flex: 0.3,
      renderCell: ({ row }) => (
        <Avatar
          src={row.profilePhoto}
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    { field: 'employeeId', headerName: 'EMPLOYEE ID', flex: 0.6 },
    { field: 'name', headerName: 'EMPLOYEE NAME', flex: 0.8 },
    {
      field: 'role',
      headerName: 'ROLE',
      flex: 0.4,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            pt: 2,
            textTransform: 'capitalize',
            color:
              {
                admin: 'success.main',
                chef: 'secondary.main',
                cashier: 'warning.main',
              }[row.role] || 'textPrimary',
            fontWeight: 600,
          }}
        >
          {row.role}
        </Typography>
      ),
    },
    { field: 'contactNo', headerName: 'CONTACT NO', flex: 0.6 },
    { field: 'email', headerName: 'EMAIL', flex: 1 },
    {
      field: 'id',
      headerName: 'ACTION',
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          spacing={1}
        >
          <IconButton
            component={Link}
            href={paths.dashboard.employee.editEmployee.replace(':id', row._id)}
          >
            <Edit color="info" />
          </IconButton>
          <IconButton onClick={() => handleDeleteEmployee(row._id)}>
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
          component={Link}
          href={paths.dashboard.employee.createEmployee}
        >
          New Employee
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
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
            '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
            pt: 1,
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#E1E1E1' },
          }}
          getRowId={(row) => row._id}
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

export default EmployeeList;
