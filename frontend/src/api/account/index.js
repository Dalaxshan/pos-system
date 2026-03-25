import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class AccountAPI {
  //view personal detail
  async getDetailsById(userId) {
    try {
      const user = await apiManager.get(API_CONSTANTS.viewDetail(userId));
      return user.data.data;
    } catch (err) {
      console.error('[AccountAPI - getDetailsById]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  //edit personal detail
  async editUser(userId, user) {
    try {
      const response = await apiManager({
        method: 'PUT',
        url: API_CONSTANTS.editDetail(userId),
        data: user,
        headers: { 'Content-type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error('[AccountAPI - editUser]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  //getAll login history
  async getAllLoginHistory() {
    try {
      const logins = await apiManager.get(API_CONSTANTS.getAllLoginHistory);
      return logins.data.data;
    } catch (err) {
      console.error('[AccountAPI - getAllLoginHistory]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  //getTop sales
  async getTopSales() {
    try {
      const topSales = await apiManager.get(API_CONSTANTS.getTopSales);
      return topSales.data.data;
    } catch (err) {
      console.error('[AccountAPI - getTopSales]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  async editLoginHistory(id, logout) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editLoginHistory(id), {
        logout: logout,
      });
      return response.data;
    } catch (err) {
      console.error('[AccountAPI - editLoginHistory]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  //getAll notification
  async getAllNotification() {
    try {
      const notifications = await apiManager.get(API_CONSTANTS.getAllNotification);
      return notifications.data.data;
    } catch (err) {
      console.error('[AccountAPI - getAllNotification]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const accountAPI = new AccountAPI();
