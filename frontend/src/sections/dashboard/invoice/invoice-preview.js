import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Grid2 } from '@mui/material';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Logo } from 'src/components/logo';
import Image from 'next/image';

export const InvoicePreview = (props) => {
  const { invoice, ...other } = props;

  const items = invoice.items || [];
  const dueDate = invoice.dueDate && format(invoice.dueDate, 'dd MMM yyyy');
  const issueDate = invoice.issueDate && format(invoice.issueDate, 'dd MMM yyyy');
  const subtotalAmount = numeral(invoice.subtotalAmount).format(`${invoice.currency}0,0.00`);
  const discount = numeral(invoice.discount).format(`${invoice.currency}0,0.00`);
  const totalAmount = numeral(invoice.totalAmount).format(`${invoice.currency}0,0.00`);
  const orderDiscount = numeral(invoice.orderDiscount).format(`${invoice.currency}0,0.00`);
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
        }}
      >
        <div>
          <Box
            sx={{
              display: 'inline-flex',
            }}
          >
            <Image
            src="/assets/maki-pos.webp"
            height={60}
            width={150}
            alt="maki pos system"
          />
          </Box>
          <Typography variant="h6">Maki POS System</Typography>
        </div>
        <div>
          <Typography
            align="right"
            variant="h4"
            sx={{
              color: 'success.main',
            }}
          >
            {invoice.status.toUpperCase()}
          </Typography>
          <Typography
            align="right"
            variant="subtitle2"
          >
            {invoice.number}
          </Typography>
        </div>
      </Stack>
      <Box sx={{ mt: 4 }}>
        <Grid2
          container
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="body2">
              No 3, Rathnamalana
              <br />
              Colombo
              <br />
              Srilanka
            </Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 4 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography variant="body2">
              Company No. 4675933
              <br />
              EU VAT No. 949 67545 45
              <br />
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography
              align="right"
              variant="body2"
            >
              possystem@mail.com
              <br />
              (+94) 77 485 4780
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Grid2
          container
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Due date
            </Typography>
            <Typography variant="body2">{dueDate}</Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 4 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Date of issue
            </Typography>
            <Typography variant="body2">{issueDate}</Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 4 }}
            sx={{ textAlign: { xs: 'left', md: 'right' } }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Number
            </Typography>
            <Typography variant="body2">{invoice.number}</Typography>
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
          {invoice.customer.name}
          <br />
          {invoice.customer.company}
          <br />
          {invoice.customer.taxId}
          <br />
          {invoice.customer.address}
        </Typography>
      </Box> */}
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Item Id</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => {
            const price = numeral(item.price).format(`${item.currency}0,0.00`);
            const totalAmount = numeral(item.totalAmount).format(`${item.currency}0,0.00`);

            return (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{price}</TableCell>
                <TableCell>{discount}</TableCell>
                <TableCell align="right">{totalAmount}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell>
              <Typography variant="subtitle1">Subtotal</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2">{subtotalAmount}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography variant="subtitle1">Discount</Typography>
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: 'none' }}
            >
              <Typography variant="subtitle2">{orderDiscount}%</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography variant="subtitle1">Total</Typography>
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: 'none' }}
            >
              <Typography variant="subtitle2">{totalAmount}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          mt: 4,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          -----------------------------------
        </Typography>
        <Typography
          gutterBottom
          variant="subtitle1"
          sx={{ pl: 6 }}
        >
          Company Stamp
        </Typography>
      </Stack>
    </Card>
  );
};

InvoicePreview.propTypes = {
  invoice: PropTypes.object.isRequired,
};
