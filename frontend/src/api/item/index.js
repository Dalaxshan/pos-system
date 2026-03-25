import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class ItemAPI {
  // Get all items
  async getAllItem() {
    try {
      const items = await apiManager.get(API_CONSTANTS.getAllItem);
      return items.data.data;
    } catch (err) {
      console.error('[ItemAPI - getAllItem]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // List all approved recipes
  async getAllApprovedRecipes() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllApprovedRecipes);
      return response.data.data;
    } catch (err) {
      console.error('[ItemAPI - getAllApprovedRecipes]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // List all recipe items
  async getAllRecipes() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllRecipes);
      return response?.data.data;
    } catch (err) {
      console.error('[ItemAPI - getAllRecipes]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get all sales items
  async getAllSalesItem() {
    try {
      const items = await apiManager.get(API_CONSTANTS.getAllSales);
      return items.data.data;
    } catch (err) {
      console.error('[ItemAPI - getAllSalesItem]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get all purchase items
  async getAllPurchaseItem() {
    try {
      const items = await apiManager.get(API_CONSTANTS.getAllPurchase);
      return items.data.data;
    } catch (err) {
      console.error('[ItemAPI - getAllPurchaseItem]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new item
  async createItem(itemData) {
    try {
      const response = await apiManager({
        method: 'POST',
        url: API_CONSTANTS.createItem,
        data: itemData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error('[ItemAPI - createItem]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
  // Count the items of the category
  async countCategoryItems() {
    try {
      const category = await apiManager.get(API_CONSTANTS.countCategory);
      return category.data.data;
    } catch (err) {
      console.error('[ItemAPI - countCategoryItems]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Edit an item
  async updateItem(itemId, item) {
    try {
      const response = await apiManager({
        method: 'PUT',
        url: API_CONSTANTS.itemById(itemId),
        data: item,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error('[ItemAPI - editItem]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get item details by ID
  async getItemById(id) {
    try {
      const response = await apiManager.get(API_CONSTANTS.itemById(id));
      return response.data.data;
    } catch (err) {
      console.error('[ItemAPI - getItemById]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Delete an item
  async deleteItem(itemId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteItem(itemId));
      return response.data;
    } catch (err) {
      console.error('[ItemAPI - deleteItem]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get all items by supplier ID
  async getAllSingleItemsBySupplierId(supplierId) {
    try {
      const items = await apiManager.get(API_CONSTANTS.getAllSingleItems(supplierId));
      return items.data;
    } catch (err) {
      console.error('[ItemAPI - getAllSingleItemsBySupplierId]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Update recipe status
  async updateRecipeStatus(itemId, status) {
    try {
      const response = await apiManager.put(API_CONSTANTS.updateRecipeStatus(itemId), {
        recipeStatus: status,
      });
      return response.data;
    } catch (err) {
      console.error('[ItemAPI - updateRecipeStatus]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const itemAPI = new ItemAPI();
