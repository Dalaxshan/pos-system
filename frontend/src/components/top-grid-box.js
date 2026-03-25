import { Box, Grid2, Typography } from '@mui/material';

export const TopGrid = ({ items }) => {
  const stackStyle = {
    border: '1px solid #DDE1E6',
    textAlign: 'center',
    pt: 4,
    pb: 4,
    borderRadius: '8px',
    backgroundColor: '#FBFBFB',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <Box sx={{ pb: 7, pl: 3 }}>
      <Grid2
        container
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {items.map((item, index) => (
          <Grid2
            size={{ xs: 12, md: 3.8 }}
            key={index}
            sx={stackStyle}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: '#868686' }}
            >
              {item.header}
            </Typography>
            <Typography variant="h4">{item.value}</Typography>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};
