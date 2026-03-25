import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import toast from 'react-hot-toast';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';
import { AccountLoginHistory } from 'src/sections/dashboard/account/account-login-history';
import { accountAPI } from 'src/api/account';
import { logout } from 'src/store/slices/auth';
import { paths } from 'src/paths';
import { ListItemButton } from '@mui/material';
import { SettingsButton } from 'src/components/settings/settings-button';
import { useSettings } from 'src/hooks/use-settings';
import { Error } from 'src/components/error';
import { getInitials } from 'src/utils/get-initials';
import { Loading } from 'src/components/loading';

const tabs = [
  { label: 'Account', value: 'general', icon: <AccountCircleIcon /> },
  { label: 'Notifications', value: 'notifications', icon: <NotificationsIcon /> },
  // { label: 'Security', value: 'security', icon: <SecurityIcon /> },

  { label: 'Login History', value: 'loginHistory', icon: <LoginOutlined /> },
];

const Page = () => {
  const [currentTab, setCurrentTab] = useState('general');
  const userId = useSelector((state) => state?.auth?.user?.id);
  const dispatch = useDispatch();
  const router = useRouter();
  const settings = useSettings();

  // login history updates
  const editLoginHistory = async (userId, logoutDate) => {
    try {
      await accountAPI.editLoginHistory(userId, logoutDate);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // sign out
  const handleSignOut = async (userId) => {
    try {
      const logoutDate = new Date();
      await editLoginHistory(userId, logoutDate);
      router.replace(paths.index);
      dispatch(logout());
      toast.success('You have successfully signed out!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTabsChange = useCallback((value) => {
    setCurrentTab(value);
  }, []);

  //get account details
  const {
    data: userData = {},
    error,
    mutate,
    isLoading,
  } = useSWRImmutable(userId ? ['user-detail', userId] : null, async () => {
    if (!userId) return null;
    const response = await accountAPI.getDetailsById(userId);
    return response;
  });
  if (isLoading) return <Loading message="loadding account details" />;
  if (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || 'Something went wrong';
    return (
      <Error
        statusCode={statusCode}
        title={errorMessage}
      />
    );
  }

  return (
    <>
      <Seo title="Dashboard: Account" />
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth="xl">
          <Grid2
            container
            spacing={3}
          >
            <Grid2
              size={{ xs: 12, md: 2.8 }}
              sx={{
                position: 'sticky',
                top: 0,
                alignSelf: 'flex-start',
                border: '1px solid #DDE1E6',
                borderRadius: '10px',
                p: 2,
                ml: 2,
                backgroundColor: '#FFFFFF',
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <List component="nav">
                  <Typography
                    variant="h7"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Personal
                  </Typography>
                </List>
                <SettingsButton onClick={settings.handleDrawerOpen} />
              </Stack>

              <List
                component="nav"
                key="nav-tabs"
              >
                {tabs.map((tab) => (
                  <ListItemButton
                    key={tab.value}
                    selected={currentTab === tab.value}
                    onClick={() => handleTabsChange(tab.value)}
                  >
                    <ListItemIcon>{tab.icon}</ListItemIcon>
                    <ListItemText primary={tab.label} />
                  </ListItemButton>
                ))}
              </List>
              <Divider />
              <List component="nav">
                <ListItemButton onClick={() => handleSignOut(userId)}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
              <Divider />
              <List
                component="nav"
                key="nav-user-info"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar src={userData?.profilePhoto ? userData.profilePhoto : undefined}>
                    {getInitials(userData?.name)}
                  </Avatar>

                  <div>
                    <Typography variant="subtitle2">{userData?.name}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {userData?.employeeId}
                    </Typography>
                  </div>
                </Stack>
              </List>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Stack spacing={3}>
                {currentTab === 'general' && (
                  <AccountGeneralSettings
                    formValues={userData}
                    mutate={mutate}
                  />
                )}
                {currentTab === 'notifications' && <AccountNotificationsSettings />}
                {currentTab === 'security' && <AccountSecuritySettings />}

                {currentTab === 'loginHistory' && <AccountLoginHistory />}
              </Stack>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
