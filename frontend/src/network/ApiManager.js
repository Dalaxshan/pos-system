import axios from 'axios';

import { errorHandler } from './errorHandler';
import { commonMessages } from 'src/utils/constants';
import { authApi } from 'src/api/auth';
import { store } from 'src/store';
import { logout, setAccessToken, setRefreshToken } from 'src/store/slices/auth';
import Router from 'next/router';
import { paths } from 'src/paths';
import toast from 'react-hot-toast';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiManager = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue = [];

// Function to refresh token
const refreshToken = async () => {
  try {
    isRefreshing = true;
    const { refreshToken } = store.getState().auth;
    const response = await authApi.refreshToken({ refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response;

    // Update access token
    store.dispatch(setAccessToken({ accessToken }));
    store.dispatch(setRefreshToken({ refreshToken: newRefreshToken }));

    // Retry all queued requests
    refreshQueue.forEach((request) => {
      request.resolve(accessToken);
    });
    refreshQueue = [];
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Reject all queued requests
    refreshQueue.forEach((request) => {
      request.reject(error);
    });
    refreshQueue = [];
    store.dispatch(logout());
    Router.replace(paths.index);
  } finally {
    isRefreshing = false;
  }
};

// Request interceptors
apiManager.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptors
apiManager.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error(JSON.stringify(error));
    const errorData = errorHandler(error);
    if (errorData.message === commonMessages.unauthorized) {
      store.dispatch(logout());
      toast.error('Session Expired. Please login again.');
      Router.replace(paths.index);
    }

    // If session expired, try to refresh token
    if (errorData.message === 'Session Expired') {
      const originalRequest = error.config;

      if (!isRefreshing) {
        // If not already refreshing, start refreshing token and queue the failed request
        isRefreshing = true;
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
          refreshToken();
        })
          .then((accessToken) => {
            // Retry the original request with the new access token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          })
          .catch((refreshError) => {
            console.error('Error retrying request after token refresh:', refreshError);
            return Promise.reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // If already refreshing, queue the failed request
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((accessToken) => {
            // Retry the original request with the new access token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          })
          .catch((retryError) => {
            console.error('Error retrying request after token refresh:', retryError);
            return Promise.reject(retryError);
          });
      }
    }

    return Promise.reject(error);
  }
);

export default apiManager;
