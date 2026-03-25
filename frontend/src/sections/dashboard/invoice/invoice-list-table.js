import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import Link from 'next/link';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { paths } from 'src/paths';
import { getInitials } from 'src/utils/get-initials';

const groupInvoices = (invoices) => {
  return invoices.reduce(
    (acc, invoice) => {
      const { status } = invoice;

      return {
        ...acc,
        [status]: [...acc[status], invoice],
      };
    },
    {
      canceled: [],
      paid: [],
      pending: [],
    }
  );
};

const statusColorsMap = {
  canceled: 'error',
  paid: 'success',
  pending: 'warning',
};

const InvoiceRow = (props) => {
  const { invoice, ...other } = props;

  const statusColor = statusColorsMap[invoice.status];
  const totalAmount = numeral(invoice.totalAmount).format('0,0.00');
  const issueDate = invoice.issueDate && format(invoice.issueDate, 'dd/MM/yyyy');
  const dueDate = invoice.dueDate && format(invoice.dueDate, 'dd/MM/yyyy');

  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      {...other}
    >
      <TableCell width="25%">
        <Stack
          direction="row"
          spacing={2}
          component={Link}
          href={paths.dashboard.invoices.details}
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <Avatar
            sx={{
              height: 42,
              width: 42,
            }}
          >
            {getInitials(invoice.customer.name)}
          </Avatar>
          <div>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.primary',
              }}
            >
              {invoice.number}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {invoice.customer.name}
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">
          {invoice.currency}
          {totalAmount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">Issued</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {issueDate}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">Due</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {dueDate}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <SeverityPill color={statusColor}>{invoice.status}</SeverityPill>
      </TableCell>
      <TableCell align="right">
        <IconButton
          component={Link}
          href={paths.dashboard.invoices.details}
        >
          <SvgIcon>
            <ArrowRightIcon />
          </SvgIcon>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

InvoiceRow.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export const InvoiceListTable = (props) => {
  const {
    group = false,
    items = [],
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  let content;

  if (group) {
    const groupedInvoices = groupInvoices(items);
    const statuses = Object.keys(groupedInvoices);

    content = (
      <Stack spacing={6}>
        {statuses.map((status) => {
          const groupTitle = status.charAt(0).toUpperCase() + status.slice(1);
          const count = groupedInvoices[status].length;
          const invoices = groupedInvoices[status];
          const hasInvoices = invoices.length > 0;

          return (
            <Stack
              key={groupTitle}
              spacing={2}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {groupTitle} ({count})
              </Typography>
              {hasInvoices && (
                <Card>
                  <Scrollbar>
                    <Table sx={{ minWidth: 600 }}>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <InvoiceRow
                            key={invoice.id}
                            invoice={invoice}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Card>
              )}
            </Stack>
          );
        })}
      </Stack>
    );
  } else {
    content = (
      <Card>
        <Table>
          <TableBody>
            {items.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <Stack spacing={4}>
      {content}
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );
};

InvoiceListTable.propTypes = {
  count: PropTypes.number,
  group: PropTypes.bool,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
