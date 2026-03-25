import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import Link from 'next/link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import Icon500 from 'public/assets/errors/error-500.webp';
import Image from 'next/image';

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Seo
        title="Error: Server Problem - We're Working on It | 500 Error Help"
        description="You have encountered a 500 error. There was an internal server error. Please try refreshing the page or come back later. We're fixing it as fast as we can."
        keywords="500 error, internal server error, server issue, error page, Diwerse"
        url="https://diwerse.com/500"
      />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          py: '80px',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 6,
            }}
          >
            <Image
              width={400}
              height={400}
              alt="500"
              src={Icon500}
              style={{
                objectFit: 'contain',
              }}
              sizes="30vw"
              placeholder="blur"
            />
          </Box>
          <Typography
            align="center"
            variant={mdUp ? 'h1' : 'h4'}
          >
            500: Internal Server Error
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            You either tried some shady route or you came here by mistake. Whichever it is, try
            using the navigation.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Button
              component={Link}
              href={paths.index}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
