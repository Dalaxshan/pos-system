import React, { useState } from 'react';
import { Card, Button, Avatar, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AppRegistration, ArtTrack, Visibility } from '@mui/icons-material';
import { CreateRecipeForm } from '../recipe/create-recipe-form';
import { recipeAPI } from 'src/api/recipe';
import useSWRImmutable from 'swr/immutable';
import { Loading } from 'src/components/loading';
import ViewComment from './view-comment';

export const SalesItemList = ({ data, isLoading ,mutate }) => {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewCommentOpen, setViewCommentOpen] = useState(false);
  const [viewCommentId, setViewCommentId] = useState(null);

  const {
    data: recipe = {},
    isLoading: loadingRecipe,
    
  } = useSWRImmutable(
    editMode && currentItem?.recipeId ? ['recipe', currentItem.recipeId] : null,
    async () => {
      const response = await recipeAPI.getRecipeById(currentItem.recipeId);
      return response;
    }
  );

  const handleOpen = (item, isEdit = false) => {
    setCurrentItem(item);
    setEditMode(isEdit);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
    setEditMode(false);
  };

  // View comment
  const handleViewComment = (recipeId) => {
    setViewCommentOpen(true);
    setViewCommentId(recipeId);
  };

  const handleCloseViewComment = () => {
    setViewCommentOpen(false);
    setViewCommentId(null);
  };

  const columns = [
    {
      field: 'itemImage',
      headerName: '',
      flex: 0.2,
      renderCell: ({ value }) => (
        <Avatar
          src={value}
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      field: 'itemId',
      headerName: 'ITEM ID',
      flex: 0.5,
    },
    {
      field: 'name',
      headerName: 'ITEM NAME',
      flex: 0.8,
    },
    {
      field: 'recipeStatus',
      headerName: 'STATUS',
      flex: 0.5,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          sx={{ textTransform: 'capitalize', width: 110 }}
          color={
            value === 'approved'
              ? 'success'
              : value === 'changes'
                ? 'info'
                : value === 'not-approved'
                  ? 'warning'
                  : 'error'
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 1,
      renderCell: ({ row }) => (
      
        <>
          {!row?.recipeId ? (
            <Button
              variant="contained"
              color="info"
              onClick={() => handleOpen(row)}
              endIcon={<ArtTrack />}
            >
              Add Recipe
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleOpen(row, true)}
              endIcon={<AppRegistration />}
            >
              Edit Recipe
            </Button>
          )}
          <Button
            variant="contained"
            color="info"
            sx={{ ml: 1 }}
            endIcon={<Visibility />}
            onClick={() => handleViewComment(row?.recipeId)}
          >
            Comment
          </Button>
        </>
      ),
    },
  ];

  if (loadingRecipe) return <Loading message="Fetching recipe details..." />;

  return (
    <>
      <Card>
        <DataGrid
          autoHeight
          loading={isLoading}
          rows={data || []}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25, 100]}
          slots={{ toolbar: GridToolbar }}
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

      {open && (
        <CreateRecipeForm
          open={open}
          handleClose={handleClose}
          itemId={currentItem?._id}
          recipe={editMode ? recipe : undefined}
          editMode={editMode}
          mutate={mutate}
        />
      )}

      {viewCommentOpen && (
        <ViewComment
          open={viewCommentOpen}
          handleClose={handleCloseViewComment}
          recipeId={viewCommentId}
        />
      )}
    </>
  );
};
