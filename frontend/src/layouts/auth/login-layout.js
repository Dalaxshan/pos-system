import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Image from 'next/image';
import posLogo from '/public/assets/maki-pos-black.webp';
import loginGif from '/public/assets/login.gif';
import { Grid2, Typography, Stack } from '@mui/material';

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      {/**main box */}
      <Box
        sx={{
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba( 0.2, 0, 0, 0.2)',
          // border: '1px solid red',

          display: 'flex',
          mt: 4,
          flexDirection: {
            xs: 'column-reverse',
            md: 'row',
          },
          height: {
            xs: 'auto',
            md: '90vh',
          },
          width: {
            xs: '100%',
            md: '63%',
          },
          mx: 'auto',
        }}
      >
        {/**left box */}
        <Box
          sx={{
            alignItems: 'center',
            color: 'common.black',
            width: '20%',
            display: 'flex',
            flex: {
              xs: '0 0 auto',
              md: '1 1 auto',
            },
            justifyContent: 'center',
            p: {
              xs: 4,
              md: 2,
            },
          }}
        >
          <Grid2
            container
            direction="column"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack
              direction="column"
              spacing={0}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                pb: 8,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: '40px', fontWeight: '250' }}
              >
                WELCOME BACK
              </Typography>

              <Typography
                variant="body2"
                sx={{ fontSize: '20px', fontWeight: '280' }}
              >
                Nice to see you again!
              </Typography>
            </Stack>

            <Image
              priority
              src={loginGif}
              height={350}
              width={350}
              alt="login gif"
            />
          </Grid2>
        </Box>

        {/** right box */}
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#F4F4F4',
            borderRadius: '0 10px 10px 0',
            width: '50%',
            flex: {
              xs: '1 1 auto',
              md: '0 0 auto',
            },
            flexDirection: 'column',
            justifyContent: {
              md: 'center',
            },
            maxWidth: '100%',
            p: {
              xs: 4,
              md: 8,
            },
            // width: {
            //   md: 450,
            // },
          }}
        >
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  height: 7,

                  width: 50,
                }}
              >
                <Image
                  src={posLogo}
                  alt="Maki Pos System"
                  width={100}
                  height={40}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>{children}</Box>
          </div>
        </Box>
      </Box>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
