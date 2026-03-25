import { PDFDownloadLink } from '@react-pdf/renderer';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Link as NextLink } from 'next/link';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { Backdrop, CircularProgress } from '@mui/material';
import { InvoicePdfDocument } from 'src/sections/dashboard/purchase/supplier-order-report/supplier-order-pdf-document';
import { InvoicePreview } from 'src/sections/dashboard/purchase/supplier-order-report/supplier-order-preview';
import { purchaseOrderApi } from 'src/api/purchase';
import { Error } from 'src/components/error';
import { Loading } from 'src/components/loading';

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: purchase = {},
    isLoading,
    error,
  } = useSWRImmutable(id ? ['get-order-by-id', id] : null, async () => {
    if (!id) return null;

    const response = await purchaseOrderApi.getPurchaseById(id);
    return response;
  });

  if (isLoading) return <Loading message="Fetching order details..." />;

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
    <>
      <Seo title="Dashboard: Purchase Details" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {!purchase ? (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <Container maxWidth="lg">
            <Stack
              divider={<Divider />}
              spacing={4}
            >
              <Stack spacing={4}>
                <Stack
                  direction="row"
                  spacing={4}
                  sx={{
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* <Stack
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
                      <Typography variant="h4">{purchase?.orderId}</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {purchase?.supplierName}
                      </Typography>
                    </div>
                  </Stack> */}

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
                        href={paths.dashboard.purchase.index}
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
                        <Typography variant="body1">Created:</Typography>
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
                    <Button variant="contained">Send E-mail</Button>
                    <PDFDownloadLink
                      document={<InvoicePdfDocument purchase={purchase} />}
                      fileName={`supplier-purchase-${purchase?.orderId}.pdf`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        sx={{
                          backgroundColor: '#474747',
                          '&:hover': {
                            backgroundColor: '#3a3a3a',
                          },
                        }}
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
        )}
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
