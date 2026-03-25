import React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';

export const DeleteDialog = ({ open, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDialog-paper': { width: '500px', height: '200px', pt: '20px', pr: '10px' } }}
    >
      <form>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant={'body2'}>Are you sure you want to delete this?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
