import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

class EmployeeAPI {
  // Get all employees
  async getAllEmployee() {
    try {
      const employees = await apiManager.get(API_CONSTANTS.getAllEmployee);
      return employees.data.data;
    } catch (err) {
      console.error('[EmployeeAPI - getAllEmployee]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get all admins
  async getAllAdmins() {
    try {
      const response = await apiManager.get(API_CONSTANTS.getAllAdmins);
      return response.data.data;
    } catch (err) {
      console.error('[EmployeeAPI - getAllAdmins]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Create a new employee
  async createEmployee(employeeData) {
    try {
      const response = await apiManager({
        method: 'POST',
        url: API_CONSTANTS.createEmployee,
        data: employeeData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error('[EmployeeAPI - createEmployee]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Edit an existing employee
  async editEmployee(employeeId, employee) {
    try {
      const response = await apiManager({
        method: 'PUT',
        url: API_CONSTANTS.editEmployee(employeeId),
        data: employee,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.error('[EmployeeAPI - editEmployee]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Get employee details by ID
  async getEmployeesById(employeeId) {
    try {
      const employee = await apiManager.get(API_CONSTANTS.getEmployee(employeeId));
      return employee.data.data;
    } catch (err) {
      console.error('[EmployeeAPI - getEmployeesById]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }

  // Delete an employee
  async deleteEmployee(employeeId) {
    try {
      const response = await apiManager.delete(API_CONSTANTS.deleteEmployee(employeeId));
      return response.data;
    } catch (err) {
      console.error('[EmployeeAPI - deleteEmployee]: ', err.response.data);
      throw new Error(err.response?.data?.userMessage);
    }
  }
}

export const employeeApi = new EmployeeAPI();
