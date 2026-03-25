import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class CategoryAPI {
  // Get all categories
  async getAllCategory() {
    try {
      const categories = await apiManager.get(API_CONSTANTS.getAllCategory);
      return categories.data.data;
    } catch (err) {
      console.error('[CategoryAPI - getAllCategory]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new category
  async createCategory(category) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createCategory, category);
      return response.data.data;
    } catch (err) {
      console.error('[CategoryAPI - createCategory]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const categoryApi = new CategoryAPI();
