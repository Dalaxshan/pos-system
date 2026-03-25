import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class MenuAPI {
  // Get all menus
  async getAllMenu() {
    try {
      const menu = await apiManager.get(API_CONSTANTS.getAllMenu);
      return menu.data.data;
    } catch (err) {
      console.error('[MenuAPI - getAllMenu]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new menu
  async createMenu(menuData) {
    try {
      const response = await apiManager({
        method: 'POST',
        url: API_CONSTANTS.createMenu,
        data: menuData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('[MenuAPI - createMenu]: ', err.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Edit an existing menu
  async editMenu(menuId, menu) {
    try {
      const response = await apiManager({
        method: 'PUT',
        url: API_CONSTANTS.editMenu(menuId),
        data: menu,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error('[MenuAPI - editMenu]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Delete a menu
  async deleteMenu(menuId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteMenu(menuId));
      return response.data;
    } catch (err) {
      console.error('[MenuAPI - deleteMenu]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get menu details by ID
  async getMenuById(menuId) {
    try {
      const menu = await apiManager.get(API_CONSTANTS.getMenu(menuId));
      return menu.data.data;
    } catch (err) {
      console.error('[MenuAPI - getMenuById]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const menuAPI = new MenuAPI();
