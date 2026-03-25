import { Card, Typography, Box, Stack } from '@mui/material';
import Image from 'next/image';
import { formatDateTime } from 'src/utils/format-date-time';
import chefLogo from '/public/assets/chef-logo.png';

export const DailyUpdate = () => {
  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: 'primary.main',
        // width: {
        //   md: '40vw',
        //   xs: '100vw',
        // },
        // height: {
        //   md: '33vh',
        //   xs: '100vh',
        // },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
            }}
          >
            Welcome to MAKI POS!
          </Typography>
          <Typography
            variant="h7"
            sx={{
              // color: '#BFBFBF',
              color:'#fff',
              mt: 2,
            }}
          >
            Today Orders: 25
          </Typography>
          <br />
          <Typography
            variant="h7"
            sx={{
              // color: '#BFBFBF',
               color:'#fff',
            }}
          >
            LKR 35,000
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              mt: 2,
            }}
          >
            {formatDateTime(new Date())}
          </Typography>
        </Box>

        <Box>
          <Image
            src={chefLogo}
            alt="Chef Logo"
            width={100}
            height={100}
          />
        </Box>
      </Stack>
    </Card>
  );
};
