import PropTypes from 'prop-types';
import { formatDate } from 'src/utils/form-date';
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
import Image from 'next/image';

export const InvoicePreview = (props) => {
  const { billing, ...other } = props;
  const dueDate = formatDate(billing?.createdAt);
  const issueDate = formatDate(billing?.createdAt);
  const discount = billing?.discount;


  return (
    <Card
      {...other}
      sx={{ p: 6 }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'inline-flex',pb:5}}>
        <Image
            src="/assets/maki-pos-black-transparent.png"
            height={60}
            width={76}
            alt="maki pos system"
          />
        </Box>
        <div>
          <Typography
            align="right"
            variant="h4"
            sx={{ color: 'success.main' }}
          >
            {billing.paymentStatus}
          </Typography>
          <Typography
            align="right"
            variant="subtitle2"
          >
            {billing.orderId}
          </Typography>
        </div>
      </Stack>
      <Box>
        <Grid2
          container
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid2
            xs={12}
            md={4}
          >
            <Typography variant="body2">
              No 3, Rathnamalana
              <br />
              Colombo
              <br />
              Sri Lanka
            </Typography>
          </Grid2>
          <Grid2
            xs={12}
            md={4}
          />
          <Grid2
            xs={12}
            md={4}
          >
            <Typography
              align="right"
              variant="body2"
            >
              accounts@possystem.com
              <br />
              011 111 2222
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Grid2
          container
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid2
            xs={12}
            md={6}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Due date
            </Typography>
            <Typography variant="body2">{dueDate}</Typography>
          </Grid2>
          <Grid2
            xs={12}
            md={6}
            sx={{ textAlign: 'right' }}
          >
            <Typography
              gutterBottom
              variant="subtitle2"
            >
              Date of issue
            </Typography>
            <Typography variant="body2">{issueDate}</Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography
          gutterBottom
          variant="subtitle2"
        >
          Billed to
        </Typography>
        <Typography variant="body2">
          {billing?.supplierId?.companyName}
          <br />
          {billing?.supplierId?.contactNumber}
          <br />
          {billing?.supplierId?.address}
        </Typography>
      </Box>
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Discount (item)</TableCell>
            <TableCell align="right">Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billing?.items?.map((item, index) => (
            <TableRow key={item._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.itemName}</TableCell>
              <TableCell align="right">
                {item.quantity.value} {item.quantity.volume}
              </TableCell>
              <TableCell align="right">LKR {item.unitPrice}</TableCell>
              <TableCell align="right">{item.discount || 0}%</TableCell>
              <TableCell align="right">LKR {item.totalPriceItem}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell
              colSpan={4}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography variant="subtitle1">No of items</Typography>
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: 'none' }}
            >
              <Typography variant="subtitle2">{billing?.items?.length}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={4}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography variant="subtitle1">Subtotal</Typography>
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: 'none' }}
            >
              <Typography variant="subtitle2">LKR {billing?.grossPrice}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={4}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography variant="subtitle1">Discount (Total order)</Typography>
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: 'none' }}
            >
              <Typography variant="subtitle2">{discount}%</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={4}
              sx={{ borderBottom: 'none' }}
            />
            <TableCell sx={{ borderBottom: 'none' }}>
              <Typography variant="subtitle1">Total</Typography>
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: 'none' }}
            >
              <Typography variant="subtitle2">LKR {billing?.netPrice}</Typography>
            </TableCell>
          </TableRow>
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
          sx={{ color: 'text.secondary' }}
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
