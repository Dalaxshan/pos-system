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
import useSWR from 'swr';
import { accountAPI } from 'src/api/account';

export const LatestNotification = () => {
  // Fetch notifications using useSWR
  const { data: notifications = [] } = useSWR('admin-notifications', async () => {
    const response = await accountAPI.getAllNotification();
    return response;
  });

   // Get the top 5 latest notifications by slicing the array
   const latestNotifications = notifications.slice(0, 4);

  return (
    <Card
      sx={{
        height: {
          md: '20vh',
          xs: '20vh',
          lg: '40vh',
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
        <Box sx={{ m: 1 }}>
          <Typography variant="subtitle1" sx={{ position: 'relative' }}>
            Latest Notifications
          </Typography>
        </Box>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">No.</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align="left">Created By</TableCell>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestNotifications.map((item, index) => (
              <TableRow
                key={item._id || index}
                // sx={{
                //   backgroundColor: item.no === '#1' ? '#ffe6e6' : 'inherit',
                // }}
              >
                <TableCell align="left">{item.no || `${index + 1}`}</TableCell>
                <TableCell align="left">{item.itemId?.name ||item.salesId?.orderId||item.recipeId?.saleItemId?.name ||item.purchaseId?.orderId|| `N/A`}</TableCell>
                <TableCell align="left">{item.createdBy?.name || 'Unknown'}</TableCell>
                <TableCell align="left">{item.type}</TableCell>
                <TableCell align="left">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default LatestNotification;
