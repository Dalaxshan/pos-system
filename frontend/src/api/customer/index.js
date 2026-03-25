import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class CustomerAPI {
  // Get all customers
  async getAllCustomer() {
    try {
      const customers = await apiManager.get(API_CONSTANTS.getAllCustomer);
      return customers.data.data;
    } catch (err) {
      console.error('[CustomerAPI - getAllCustomer]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new customer
  async createCustomer(customerData) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createCustomer, customerData);
      return response.data.data;
    } catch (err) {
      console.error('[CustomerAPI - createCustomer]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get customer details by ID
  async getCustomerById(customerId) {
    try {
      const customer = await apiManager.get(API_CONSTANTS.getCustomerById(customerId));
      return customer.data.data;
    } catch (err) {
      console.error('[CustomerAPI - getCustomerById]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const customerAPI = new CustomerAPI();
