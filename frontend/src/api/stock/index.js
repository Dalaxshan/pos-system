import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class StockAPI {
  // Get all stocks
  async getAllStock() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllStock);
      return response.data.data;
    } catch (error) {
      console.error('[StockAPI - getAllStock]:', error.response?.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Create stock
  async createStock(stockData) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createStock, stockData);
      return response.data;
    } catch (error) {
      console.error('[StockAPI - createStock]:', error.response?.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get stock by ID
  async getStockById(stockId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.getStockById(stockId));
      return response.data.data;
    } catch (error) {
      console.error('[StockAPI - getStockById]:', error.response?.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Delete stock
  async deleteStock(stockId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteStock(stockId));
      return response.data;
    } catch (error) {
      console.error('[StockAPI - deleteStock]:', error.response?.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  async editStock(stockId, stockData) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editStock(stockId), stockData);
      return response.data;
    } catch (error) {
      console.error('[StockAPI - editStock]:', error.response?.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get current stock by item
  async getCurrentStock() {
    try {
      const response = await apiManager.get(API_CONSTANTS.currentStock);
      return response.data.data;
    } catch (error) {
      console.error('[StockAPI - getStockByItem]:', error.response?.data);
      throw new Error(error.response?.data?.userMessage);
    }
   
  }
}

export const stockApi = new StockAPI();
