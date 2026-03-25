import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import Link from 'next/link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import Image from 'next/image';
import Icon401 from 'public/assets/errors/error-401.webp';

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Seo title="Error: Authorization Required" />
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
              width: '100%',
              display: 'flex',
              justifyContent: 'center',

              mb: 6,
            }}
          >
            <Box
              width={'50vw'}
              height={'40vh'}
              position={'relative'}
            >
              <Image
                fill
                alt="401"
                src={Icon401}
                style={{
                  objectFit: 'contain',
                }}
                sizes="30vw"
                placeholder="blur"
              />
            </Box>
          </Box>
          <Typography
            align="center"
            variant={mdUp ? 'h1' : 'h4'}
          >
            401: Authorization required
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
              mt: 3,
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
