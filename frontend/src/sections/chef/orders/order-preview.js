import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { formatDateTime } from 'src/utils/format-date-time';
import { Grid2 } from '@mui/material';

export const InvoicePreview = (props) => {
  const { billing, ...other } = props;

  return (
    <Card
      {...other}
      sx={{ p: 6 }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pb:5
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
          }}
        >
         <Image
            src="/assets/maki-pos-black-transparent.png"
            height={60}
            width={76}
            alt="maki pos system"
          />
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="h4"
            sx={{
              color: 'success.main',
            }}
          >
            {billing.paymentStatus}
          </Typography>
          <Typography variant="subtitle2">{billing.serviceStatus}</Typography>
        </Box>
      </Stack>

      <Box>
        <Grid2
          container
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Ordered Date
            </Typography>
            <Typography variant="body2">{formatDateTime(billing?.createdAt)}</Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{ textAlign: 'right' }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Date of Issue
            </Typography>
            <Typography variant="body2">{formatDateTime(billing?.createdAt)}</Typography>
          </Grid2>
        </Grid2>
      </Box>
      {/* <Box sx={{ mt: 4 }}>
        <Typography
          gutterBottom
          variant="subtitle2"
        >
          Billed to
        </Typography>
        <Typography variant="body2">
          {billing?.customerName}
        </Typography>
      </Box> */}
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Item ID</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Variations</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="right">Qty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billing.items?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.itemId}</TableCell>
              <TableCell>{item.itemName}</TableCell>
              <TableCell>
              {item.customizations?.map((customization) => customization.variation).join(', ')}
              </TableCell>
              <TableCell>{item.note}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mt: 2 }}>
        <Typography
          gutterBottom
          variant="h6"
        >
          Notes
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Please make sure to check details before the due date.
        </Typography>
      </Box>
    </Card>
  );
};

InvoicePreview.propTypes = {
  billing: PropTypes.object.isRequired,
};
