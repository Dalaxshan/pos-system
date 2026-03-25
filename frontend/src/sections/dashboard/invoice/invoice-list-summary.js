import ClockIcon from '@untitled-ui/icons-react/build/esm/Clock';
import ReceiptCheckIcon from '@untitled-ui/icons-react/build/esm/ReceiptCheck';
import ReceiptIcon from '@untitled-ui/icons-react/build/esm/Receipt';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid2 } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const InvoiceListSummary = () => (
  <div>
    <Grid2
      container
      spacing={3}
    >
      <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  height: 48,
                  width: 48,
                }}
              >
                <ReceiptIcon />
              </Avatar>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Total
                </Typography>
                <Typography variant="h6">$5,300.00</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  from 12 invoices
                </Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: 'success.lightest',
                  color: 'success.main',
                  height: 48,
                  width: 48,
                }}
              >
                <ReceiptCheckIcon />
              </Avatar>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Paid
                </Typography>
                <Typography variant="h6">$1,439.60</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  from 3 invoices
                </Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: 'warning.lightest',
                  color: 'warning.main',
                  height: 48,
                  width: 48,
                }}
              >
                <ClockIcon />
              </Avatar>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Pending
                </Typography>
                <Typography variant="h6">$276.87</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  from 2 invoices
                </Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  </div>
);
