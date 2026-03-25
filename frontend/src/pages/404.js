import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import Link from 'next/link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import Icon404 from 'public/assets/errors/error-404.webp';
import Image from 'next/image';

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Seo
        title="Error: Page Not Found - We Can't Find What You're Looking"
        description="You have encountered a 404 error. The page you are looking for does not exist. Please check the URL or navigate back to the homepage."
        keywords="404 error, page not found, error page, Diwerse"
        url="https://diwerse.com/404"
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
              alt="404"
              src={Icon404}
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
            404: The page you are looking for isn’t here
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
