import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Typography,
  Box,
} from '@mui/material';

import { stockApi } from 'src/api/stock';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';
import useSWRImmutable from 'swr/immutable';

export const StockSummary = () => {
  //fetch current stock
  const { data, isLoading, error } = useSWRImmutable('current-stock', async () => {
    const response = await stockApi.getCurrentStock();
    return response;
  });

  if (isLoading) return <Loading message="loading current stock details" />;
  if (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'Something went wrong';
    return (
      <Error
        statusCode={statusCode}
        title={errorMessage}
      />
    );
  }

  return (
    <Card
      sx={{
        height: {
          md: '36vh',
          xs: '50vh',
          lg: '54vh',
        },
      }}
    >
      <TableContainer
        sx={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maxHeight: 'calc(100% - 1px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box sx={{ m: 2 }}>
          <Typography variant="subtitle1">Stock Summary</Typography>
        </Box>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">Item No</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Current stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item._id}
                sx={{
                  backgroundColor: item.quantity?.value === 0 ? '#ffe6e6' : 'inherit',
                }}
              >
                <TableCell align="left">{item?.itemId}</TableCell>
                <TableCell align="left">{item?.itemName}</TableCell>
                <TableCell align="left">
                  {item?.quantity?.value === 0 ? 'Out of stock' : item?.quantity?.value}
                  {item?.quantity?.value === 0 ? '' : item?.quantity?.volume}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default StockSummary;
