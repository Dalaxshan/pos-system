import { Dialog, Typography, Box, Grid2, DialogTitle, DialogContent, Button } from '@mui/material';
import Image from 'next/image';
import TakeAway from 'public/assets/take-away.webp';
import pickme from 'public/assets/pickme.webp';
import uber from 'public/assets/uber.webp';

const AddTakeAway = (props) => {
  const { open, handleClose, handleOption } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Typography
          variant="h6"
          align="center"
        >
          Select Options
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Grid2
            container
            spacing={2}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOption('walk-in')}
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
              >
                <Image
                  src={TakeAway}
                  height={70}
                  width={75}
                  alt="take-away"
                  placeholder="blur"
                />
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOption('uber')}
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
              >
                <Image
                  src={uber}
                  height={50}
                  width={75}
                  alt="uber"
                  placeholder="blur"
                />
              </Button>
            </Grid2>
            <Grid2
              size={{ xs: 12, md: 4 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
               <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOption('pick-me')}
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
              >
                <Image
                  placeholder="blur"
                  src={pickme}
                  height={78}
                  width={75}
                  alt="pickme"
                />
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddTakeAway;
