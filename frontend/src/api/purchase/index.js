import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class PurchaseOrderAPI {
  // Get all purchase orders
  async getAllPurchaseOrders() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllPurchasesOrder);
      return response.data.data;
    } catch (err) {
      console.error('[PurchaseOrderAPI - getAllPurchaseOrders]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  async getAggregatedAverageProfit() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAggregatedAverageProfit);
      return response.data.data;
    } catch (error) {
      console.error('[ProfitAPI - getAggregatedAverageProfit]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }
  
  // Create a purchase order
  async createPurchaseOrder(orderedData) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createPurchase, orderedData);
      return response.data;
    } catch (error) {
      console.error('[PurchaseOrderAPI - createPurchaseOrder]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get purchase order by ID
  async getPurchaseById(orderId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.getPurchaseById(orderId));
      return response.data.data;
    } catch (error) {
      console.error('[PurchaseOrderAPI - getPurchaseById]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Delete a purchase order
  async deletePurchase(orderId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deletePurchase(orderId));
      return response.data;
    } catch (err) {
      console.error('[PurchaseOrderAPI - deletePurchase]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Edit a purchase order
  async editPurchase(orderId, orderedData) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editPurchase(orderId), orderedData);
      return response.data;
    } catch (error) {
      console.error('[PurchaseOrderAPI - editPurchaseOrder]: ', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }
}

export const purchaseOrderApi = new PurchaseOrderAPI();
