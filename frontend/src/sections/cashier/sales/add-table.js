import { diningAPI } from 'src/api/dining';
import useSWR from 'swr';
import { Dialog, Typography, Box, DialogTitle, DialogContent, Button, Grid2 } from '@mui/material';
import { useState } from 'react';
import { Error } from 'src/components/error';
import { Loading } from 'src/components/loading';

const AddTables = (props) => {
  const { open, handleClose, handleDining } = props;
  const [selectedTable, setSelectedTable] = useState(null);

  // Get all available tables
  const {
    data: tables = [],
    error,
    isLoading,
  } = useSWR('available-tables', async () => {
    const response = await diningAPI.getAllAvailableTables();
    return response;
  });



  if (isLoading) return <Loading message="Fetching tables..." />;
  if (error) {
    return (
      <Error
        statusCode={error.response?.status || 500}
        title={error.message || 'Something went wrong'}
      />
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Typography
          variant="h6"
          align="center"
        >
          Select Table
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            '::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent',
            },
          }}
        >
          <Grid2
            container
            spacing={2}
            sx={{ p: 2 }}
          >
            {tables.length === 0 ? (
              <Typography
                align="center"
                sx={{ py: 3, width: '100%' }}
              >
                No available tables
              </Typography>
            ) : (
              tables.map((table) => (
                <Grid2
                  size={{ xs: 12, md: 6 }}
                  key={table._id}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      height: 80,
                      borderColor: 'gray',
                      color: 'gray',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                    onClick={() => {
                      setSelectedTable(table);
                      handleDining(table);
                    }}
                  >
                    <Typography sx={{ fontSize: '15px', fontWeight: '500', color: 'info.main' }}>
                      {table.tableName}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: '400' }}>
                      Chairs: {table.chairs}
                    </Typography>
                  </Button>
                </Grid2>
              ))
            )}
          </Grid2>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddTables;
