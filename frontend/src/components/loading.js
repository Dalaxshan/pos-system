import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';

export const Loading = (props) => {
  const { message } = props;
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 6,
          }}
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Typography
            align="center"
            variant={mdUp ? 'overline' : 'h5'}
          >
            {message || 'Loading...'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};
