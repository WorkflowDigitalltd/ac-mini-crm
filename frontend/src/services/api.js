import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Customer API calls
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomer = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/customers`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_URL}/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
};

// Product API calls
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Sales API calls
export const getSales = async () => {
  try {
    const response = await axios.get(`${API_URL}/sales`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const getSale = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sale ${id}:`, error);
    throw error;
  }
};

export const createSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_URL}/sales`, saleData);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

export const updateSale = async (id, saleData) => {
  try {
    const response = await axios.put(`${API_URL}/sales/${id}`, saleData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sale ${id}:`, error);
    throw error;
  }
};

export const deleteSale = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sale ${id}:`, error);
    throw error;
  }
};
