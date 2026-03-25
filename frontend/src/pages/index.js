import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Seo } from 'src/components/seo';
import { GuestGuard } from 'src/guards/guest-guard';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { paths } from 'src/paths';
import Link from 'next/link';
import { Grid2, Button } from '@mui/material';
import Image from 'next/image';
import adminImg from 'public/assets/admin.webp';
import cashierImg from 'public/assets/cashier.webp';
import chefImg from 'public/assets/chef.webp';
import { Role } from 'src/utils/role';

const Page = () => {
  return (
    <>
      <Seo title="Login" />
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          width: '100%',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          direction="column"
          spacing={1}
          sx={{
            alignItems: 'center',
            paddingBottom: '28px',
          }}
        >
          <Typography variant="h6">Welcome to Maki POS!</Typography>
        </Stack>

        <Grid2
          container
          spacing={2}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: '100px',
                borderColor: 'gray',
                color: 'gray',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
              LinkComponent={Link}
              href={paths.loginIntegrationRole.replace(':Role', Role.Admin.label)}
            >
              <Image
                src={adminImg}
                height={42}
                width={42}
                alt="Admin"
              />
              ADMIN
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: '100px',
                borderColor: 'gray',
                color: 'gray',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
              LinkComponent={Link}
              href={paths.loginIntegrationRole.replace(':Role', Role.Cashier.label)}
            >
              <Image
                src={cashierImg}
                height={45}
                width={45}
                alt="Cashier"
              />
              CASHIER
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: '100px',

                borderColor: 'gray',
                color: 'gray',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
              LinkComponent={Link}
              href={paths.loginIntegrationRole.replace(':Role', Role.Chef.label)}
            >
              <Image
                src={chefImg}
                height={50}
                width={60}
                alt="Chef"
              />
              KITCHEN
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <GuestGuard>
    <AuthLayout>{page}</AuthLayout>
  </GuestGuard>
);

export default Page;
