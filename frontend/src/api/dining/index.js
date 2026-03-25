import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class DiningAPI {
  // Get all branches
  async getAllBranches() {
    try {
      const branches = await apiManager.get(API_CONSTANTS.getAllBranches);
      return branches.data.data;
    } catch (err) {
      console.error('[DiningAPI - getAllBranches]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new branch
  async createBranch(data) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createBranch, data);
      return response.data?.data;
    } catch (err) {
      console.error('[DiningAPI - createBranch]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new table
  async createTable(data) {
    try {
      const response = await apiManager.post(API_CONSTANTS.createTable, data);
      return response.data?.data;
    } catch (err) {
      console.error('[DiningAPI - createTable]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get all tables by branch ID
  async getAllTablesByBranchId(branchId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.listTables(branchId));

      return response?.data?.data;
    } catch (err) {
      console.error('[DiningAPI - getAllTablesByBranchId]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get all available tables
  async getAllAvailableTables() {
    try {
      const response = await apiManager.get(API_CONSTANTS.listAvailableTables);
      return response.data.data;
    } catch (err) {
      console.error('[DiningAPI - getAllAvailableTables]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Edit a branch
  async editBranch(branchId, branch) {
    try {
      const response = await apiManager.put(API_CONSTANTS.editBranch(branchId), branch);
      return response.data;
    } catch (error) {
      console.error('[DiningAPI - editBranch]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Delete a branch
  async deleteBranch(branchId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteBranch(branchId));
      return response.data;
    } catch (error) {
      console.error('[DiningAPI - deleteBranch]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Delete a table
  async deleteTable(tableId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteTable(tableId));
      return response.data;
    } catch (error) {
      console.error('[DiningAPI - deleteTable]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }

  // Get branch details by ID
  async getBranchById(branchId) {
    try {
      const response = await apiManager.get(API_CONSTANTS.getBranchById(branchId));
      return response.data.data;
    } catch (error) {
      console.error('[DiningAPI - getBranchById]:', error.response.data);
      throw new Error(error.response?.data?.userMessage);
    }
  }
}

export const diningAPI = new DiningAPI();
