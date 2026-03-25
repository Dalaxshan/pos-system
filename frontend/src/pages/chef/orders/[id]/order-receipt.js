import { PDFDownloadLink } from '@react-pdf/renderer';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { Box, Button, Container, Link, Stack, SvgIcon, Typography } from '@mui/material';
import { Link as NextLink } from 'next/link';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/chef';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { salesOrderApi } from 'src/api/sales';
import { InvoicePdfDocument } from 'src/sections/chef/orders/order-pdf-document';
import { InvoicePreview } from 'src/sections/chef/orders/order-preview';
import { Loading } from 'src/components/loading';
import { Error } from 'src/components/error';

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

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
        sx={{ flexGrow: 1, py: 2 }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <Stack
                direction="row"
                spacing={4}
                sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <div>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={paths.chef.orders.index}
                      sx={{ alignItems: 'center', display: 'inline-flex' }}
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
                      sx={{ alignItems: 'center' }}
                    >
                      <Typography variant="body1">Cashier:</Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {purchase?.employeeId?.name} ({purchase?.employeeId?.employeeId})
                      </Typography>
                    </Stack>
                  </div>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center' }}
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
            <Box sx={{ pl: 5, pr: 1 }}>
              <InvoicePreview billing={purchase} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
