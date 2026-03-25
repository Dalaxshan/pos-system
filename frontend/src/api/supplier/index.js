import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class SupplierAPI {
  // Get all suppliers
  async getAllSuppliers() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllSupplier);
      return response.data.data;
    } catch (error) {
      console.error('[SupplierAPI - getAllSuppliers]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Create a supplier
  async createSupplier(supplierData) {
    try {
      const response = await apiManager({
        method: 'POST',
        url: API_CONSTANTS.createSupplier,
        data: supplierData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('[SupplierAPI - createSupplier]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Edit a supplier
  async editSupplier(supplierId, supplier) {
    try {
      const response = await apiManager({
        method: 'PUT',
        url: API_CONSTANTS.editSupplier(supplierId),
        data: supplier,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('[SupplierAPI - editSupplier]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Delete a supplier
  async deleteSupplier(supplierId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteSupplier(supplierId));
      return response.data;
    } catch (error) {
      console.error('[SupplierAPI - deleteSupplier]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get supplier details by ID
  async getSupplierById(supplierId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.getSupplier(supplierId));
      return response.data.data;
    } catch (error) {
      console.error('[SupplierAPI - getSupplierById]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }
}

export const supplierAPI = new SupplierAPI();
