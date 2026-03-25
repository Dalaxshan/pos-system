import * as Yup from 'yup';
import { useFormik } from 'formik';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Seo } from 'src/components/seo';
import { GuestGuard } from 'src/guards/guest-guard';
import { useMounted } from 'src/hooks/use-mounted';
import { useRouter } from 'next/router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { Layout as AuthLayout } from 'src/layouts/auth/login-layout';
import { paths } from 'src/paths';
import { LoadingButton } from '@mui/lab';
import { FormHelperText } from '@mui/material';
import { useDispatch } from 'react-redux';
import { authApi } from 'src/api/auth';
import { login } from 'src/store/slices/auth';
import toast from 'react-hot-toast';
import { Typewriter } from 'react-simple-typewriter';

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const dispatch = useDispatch();

  const role = router.query?.role;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await authApi.signIn({ email: values.email, password: values.password });

        toast.success('Successfully Logged In!');
        dispatch(
          login({
            user: {
              id: response?.id,
              email: response.email,
              name: response.name,
              status: response?.status,
              role: response?.role,
            },
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        );

        if (isMounted()) {
          if (response.role === 'admin') {
            router.push(returnTo || paths.dashboard.index);
          } else if (response.role === 'cashier') {
            router.push(returnTo || paths.cashier.index);
          } else {
            router.push(returnTo || paths.chef.orders.index);
          }
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  return (
    <>
      <Seo title="Login" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            height: '400px',
            width: '400px',
            // backgroundColor: 'white',
            borderRadius: '12px',
            pt: '10px',
            pl: '40px',
            pr: ' 40px',
            marginBottom: '40px',
            // boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack
            direction="column"
            spacing={1}
            sx={{
              alignItems: 'start',
              paddingBottom: '28px',
            }}
          >
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 450,
                color: 'primary.main',
              }}
            >
              Hello there!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: 'block',
                color: '#CECECE',
                fontWeight: '300',
              }}
            >
              <Typewriter
                words={['Welcome to Maki POS System', 'Please login to continue...']}
                loop={5}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 300,
                }}
              >
                {role}
              </Typography>
            </Box>
          </Stack>
          <form
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <Stack
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <TextField
                  label="Email Address"
                  autoFocus
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  label="Password"
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Box>
              {formik.errors.submit && (
                <FormHelperText
                  error
                  sx={{ mt: 3, width: '100%', textAlign: 'center' }}
                >
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Box
                sx={{
                  pt: 3,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
                }}
              >
                <LoadingButton
                  loading={formik.isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    width: '100%',
                  }}
                >
                  Log In
                </LoadingButton>
              </Box>
              {/* <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Typography variant="body2">If have not any account?</Typography>
              <Link
                variant="subtitle2"
                component={Link}
                href={paths.register}
              >
                Register
              </Link>
            </Stack> */}
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <GuestGuard>
    <AuthLayout>{page}</AuthLayout>
  </GuestGuard>
);

export default Page;
