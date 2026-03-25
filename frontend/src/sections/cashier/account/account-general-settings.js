import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { alpha } from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const AccountGeneralSettings = (props) => {
  const { avatar, email, name } = props;

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Grid2
            container
            spacing={3}
          >
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6">Basic details</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      borderColor: 'neutral.300',
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      p: '4px',
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '50%',
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: '50%',
                          color: 'common.white',
                          cursor: 'pointer',
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'center',
                          left: 0,
                          opacity: 0,
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          zIndex: 1,
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: 'center',
                          }}
                        >
                          <SvgIcon color="inherit">
                            <Camera01Icon />
                          </SvgIcon>
                          <Typography
                            color="inherit"
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            Select
                          </Typography>
                        </Stack>
                      </Box>
                      <Avatar
                        src={avatar}
                        sx={{
                          height: 100,
                          width: 100,
                        }}
                      >
                        <SvgIcon>
                          <User01Icon />
                        </SvgIcon>
                      </Avatar>
                    </Box>
                  </Box>
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Change
                  </Button>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    defaultValue={name}
                    label="Full Name"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Save
                  </Button>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    defaultValue={email}
                    disabled
                    label="Email Address"
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed',
                      },
                    }}
                  />
                  <Button
                    color="inherit"
                    size="small"
                  >
                    Edit
                  </Button>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid2
            container
            spacing={3}
          >
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6">Public profile</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack
                divider={<Divider />}
                spacing={3}
              >
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">Make Contact Info Public</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      Means that anyone viewing your profile will be able to see your contacts
                      details.
                    </Typography>
                  </Stack>
                  <Switch />
                </Stack>
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">Available to hire</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      Toggling this will let your teammates know that you are available for
                      acquiring new projects.
                    </Typography>
                  </Stack>
                  <Switch defaultChecked />
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid2
            container
            spacing={3}
          >
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6">Delete Account</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack
                spacing={3}
                sx={{
                  alignItems: 'flex-start',
                }}
              >
                <Typography variant="subtitle1">
                  Delete your account and all of your source data. This is irreversible.
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                >
                  Delete account
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
