import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import posLogo from 'public/assets/maki-pos-black.webp';
import Link from 'next/link';
import { paths } from 'src/paths';
import Image from 'next/image';
import { Typography } from '@mui/material';

const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top center',
  backgroundImage: 'url("/assets/gradient-bg.svg")',
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  height: '100%',
}));

export const Layout = (props) => {
  const { children } = props;

  return (
    <LayoutRoot>
      <Box
        component="header"
        sx={{
          left: 0,
          position: 'fixed',
          right: 0,
          top: 20,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={2}
            sx={{ height: TOP_NAV_HEIGHT }}
          >
            <Stack
              component={Link}
              direction="row"
              href={paths.index}
              spacing={1}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
                textDecoration: 'none',
              }}
            >
              <Image
                priority
                src={posLogo}
                alt="Maki POS Logo"
                width={80}
                height={52}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flex: '1 1 auto',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '80px',
            },
          }}
        >
          {children}
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          py: 1,
          textAlign: 'right',
        }}
        {...props}
      >
        <Container
          maxWidth="lg"
          sx={{ textAlign: { xs: 'center', sm: 'center' } }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
            }}
          >
            Powered by{' '}
            <Link
              href="https://thewebsushi.com/"
              style={{ color: '#f58e62', textDecoration: 'none' }}
            >
              The Web Sushi
            </Link>{' '}
            © All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </LayoutRoot>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
