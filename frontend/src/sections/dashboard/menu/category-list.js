import React, { useState } from 'react';
import { Box, Card, Typography, Button, Stack, SvgIcon, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import CategoryPopover from 'src/pages/dashboard/category/category-popover';

export const CategoryList = (props) => {
  const { data, categoryMutate } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: 'categoryId',
      headerName: 'Category Id',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.categoryId}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
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
      field: 'categoryName',
      headerName: 'Category',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.categoryName}
        </Typography>
      ),
    },

    {
      field: 'NoOfItems',
      headerName: 'No of Items',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography
          variant="body2"
          sx={{ pl: 3 }}
        >
          {row.noOfItems}
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
          // component={Link}
          // href={`${paths.dashboard.menu.index}/${params.row._id}/edit-menu`}
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
            onClick={handleClick}
            sx={{
              width: '134px',
              mr: 1,
            }}
          >
            Add Category
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

      <CategoryPopover
        handleClose={handlePopClose}
        anchorEl={anchorEl}
        categoryMutate={categoryMutate}
      />
    </>
  );
};

export default CategoryList;
