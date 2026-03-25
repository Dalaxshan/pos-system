import { authApi } from 'src/api/auth';
import toast from 'react-hot-toast';
import Router from 'next/router';
import { paths } from 'src/paths';
import { login } from '../slices/auth';

const loginAdmin = (params) => async (dispatch) => {
  try {
    const response = await authApi.signIn(params);

    dispatch(
      login({
        user: {
          id: response.id,
          email: response.email,
          name: response.name,
          role: response.role,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })
    );

    toast.success('You have successfully logged in!');
    Router.replace(paths.dashboard.index);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    throw err;
  }
};
export const thunks = {
  loginAdmin,
};
