import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SvgIcon, Box } from '@mui/material';
import { TableBarOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import { diningAPI } from 'src/api/dining';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { DeleteDialog } from 'src/components/delete-dialog';
import { toast } from 'react-hot-toast';
import { Error } from 'src/components/error';

export const ListTables = (props) => {
  const { data, mutate, error } = props;
  const [open, setOpen] = useState(false);
  const [tabId, setTabId] = useState();

  if (error) {
    return (
      <Error
        statusCode={error.response?.status || 500}
        title={error.message || 'Failed to load tables'}
      />
    );
  }

  const handleDeleteTable = (tableId) => {
    setOpen(true);
    setTabId(tableId);
  };

  // delete table
  const onDelete = async () => {
    try {
      await diningAPI.deleteTable(tabId);
      toast.success('Table deleted!');
      setOpen(false);
      setTabId(null);
      mutate();
    } catch (error) {
      toast.error('Failed to delete!');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          maxHeight: '90vh',
          overflowY: 'auto',
          pr: 2,
          display: 'flex',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ mt: 2, mb: 2 }}
        >
          {data && data.length === 0 ? (
            <Typography sx={{ py: 30, px: 30 }}>No tables to show</Typography>
          ) : (
            data?.map((table) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={table._id}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: table.tableStatus == 'Occupied' ? '#EFEFEF' : 'defaultColor',
                  }}
                >
                  <SvgIcon sx={{ mr: 2 }}>
                    <TableBarOutlined sx={{ color: 'info.main' }} />
                  </SvgIcon>
                  <Stack
                    direction={'row'}
                    spacing={2}
                    sx={{
                      width: '100%',
                      alignItems: 'top center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <Typography sx={{ fontSize: '15px', fontWeight: '500', color: 'info.main' }}>
                        {table.tableName}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: '400' }}>
                        Chairs: {table.chairs}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: '400' }}>
                        {table.tableStatus}
                      </Typography>
                    </div>
                    <IconButton onClick={() => handleDeleteTable(table._id)}>
                      <SvgIcon>
                        <DeleteIcon sx={{ color: '#FF5151', fontSize: 'small' }} />
                      </SvgIcon>
                    </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <DeleteDialog
        open={open}
        onDelete={onDelete}
        onClose={handleClose}
      />
    </>
  );
};
