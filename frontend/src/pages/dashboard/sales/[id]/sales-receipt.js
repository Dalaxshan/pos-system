import { PDFDownloadLink } from '@react-pdf/renderer';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Link as NextLink } from 'next/link';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { salesOrderApi } from 'src/api/sales';
import { Error } from 'src/components/error';
import { Loading } from 'src/components/loading';
import { InvoicePreview } from 'src/sections/cashier/sales/customer-bill-report/sales-order-preview';
import { InvoicePdfDocument } from 'src/sections/cashier/sales/customer-bill-report/sales-order-pdf-document';

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  //get customer order details
  const {
    data: purchase = {},
    error,
    isLoading,
  } = useSWR(id ? ['customer-orders', id] : null, async () => {
    const response = await salesOrderApi.getSaleOrderById(id);
    return response;
  });

  if (isLoading) return <Loading message="Fetching order  details..." />;
  if (error) {
    return (
      <Error
        statusCode={error?.statusCode || 500}
        title="Error fetching customer order"
      />
    );
  }

  return (
    <>
      <Seo title="Dashboard: Customer purchases" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={paths.dashboard.sales.index}
                      sx={{
                        alignItems: 'center',
                        display: 'inline-flex',
                      }}
                      underline="hover"
                    >
                      <SvgIcon sx={{ mr: 1 }}>
                        <ArrowLeftIcon />
                      </SvgIcon>
                    </Link>
                  </div>
                  <div>
                    <Typography variant="h4">{purchase?.orderId}</Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body1">Cashier:</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {purchase?.employeeId?.name} ( {purchase?.employeeId?.employeeId})
                      </Typography>
                    </Stack>
                  </div>
                </Stack>
                
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <PDFDownloadLink
                    document={<InvoicePdfDocument purchase={purchase} />}
                    fileName={`purchase-${purchase?.orderId}.pdf`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                    >
                      Download
                    </Button>
                  </PDFDownloadLink>
                </Stack>
              </Stack>
            </Stack>
            <InvoicePreview billing={purchase} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
