import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class SalesOrderAPI {
  // Get all sale orders
  async getAllSaleOrders() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllSaleOrders);
      return response.data.data;
    } catch (error) {
      console.error('[SalesOrderAPI - getAllSaleOrders]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Create a sale order
  async createSaleOrder(orderData) {
    try {
      const response = await apiManager.post(API_CONSTANTS.salesOrder, orderData);
      return response.data?.data;
    } catch (error) {
      console.error('[SalesOrderAPI - createSaleOrder]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get sale order by ID
  async getSaleOrderById(orderId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.getSaleOrderById(orderId));
      return response?.data.data;
    } catch (error) {
      console.error('[SalesOrderAPI - getSaleOrderById]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get top sales
  async getTopSales() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getTopSales);
      return response?.data;
    } catch (error) {
      console.error('[SalesOrderAPI - getTopSales]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiManager.put(API_CONSTANTS.updateOrderStatus(orderId), {
        orderStatus: status,
      });
      return response.data;
    } catch (error) {
      console.error('[SalesOrderAPI - updateOrderStatus]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Create a sale order
  async updateSale(id, orderData) {
    try {
      const response = await apiManager.put(API_CONSTANTS.updateSaleOrder(id), orderData);
      return response.data?.data;
    } catch (error) {
      console.error('[SalesOrderAPI - update saleOrder]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId, status) {
    try {
      const response = await apiManager.put(API_CONSTANTS.updatePaymentStatus(orderId), {
        paymentStatus: status,
      });
      return response.data;
    } catch (error) {
      console.error('[SalesOrderAPI - updatePaymentStatus]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Delete sale order
  async deleteSaleOrder(orderId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteSaleOrder(orderId));
      return response.data;
    } catch (error) {
      console.error('[SalesOrderAPI - deleteSaleOrder]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }
}

export const salesOrderApi = new SalesOrderAPI();
