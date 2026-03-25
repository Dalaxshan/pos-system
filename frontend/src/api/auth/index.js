import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class AuthApi {
  async signIn(request) {
    const { email, password } = request;
    try {
      const response = await apiManager.post(API_CONSTANTS.login, {
        email,
        password,
      });
      return response.data.data;
    } catch (err) {
      console.error('[Auth Api]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  async refreshToken(request) {
    const { refreshToken } = request;
    try {
      const response = await apiManager.post(API_CONSTANTS.refreshToken, {
        refreshToken,
      });

      return response.data.data;
    } catch (err) {
      console.error('[Auth Api]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const authApi = new AuthApi();
