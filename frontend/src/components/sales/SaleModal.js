import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import { createSale, updateSale, getProduct } from '../../services/api';
import { formatCurrency } from '../../utils/validation';

const SaleModal = ({ open, onClose, sale, customers, products }) => {
  const initialFormState = {
    customerId: '',
    productId: '',
    quantity: 1,
    saleDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    totalAmount: 0
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (sale) {
      // Format the date from ISO to YYYY-MM-DD for the input field
      const formattedDate = new Date(sale.saleDate).toISOString().split('T')[0];
      
      setFormData({
        customerId: sale.customerId || '',
        productId: sale.productId || '',
        quantity: sale.quantity || 1,
        saleDate: formattedDate,
        totalAmount: sale.totalAmount || 0
      });
      
      // Fetch product details if we have a productId
      if (sale.productId) {
        const product = products.find(p => p.id === sale.productId);
        setSelectedProduct(product || null);
      }
    } else {
      setFormData(initialFormState);
      setSelectedProduct(null);
    }
    setErrors({});
    setSubmitError(null);
  }, [sale, open, products]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    // Special handling for product selection to update price
    if (name === 'productId' && value) {
      const product = products.find(p => p.id === parseInt(value));
      setSelectedProduct(product || null);
      
      // Update total amount based on selected product and current quantity
      if (product) {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value),
          totalAmount: product.price * prev.quantity
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value)
        }));
      }
    } 
    // Special handling for quantity to update total amount
    else if (name === 'quantity' && selectedProduct) {
      const quantity = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: quantity,
        totalAmount: selectedProduct.price * quantity
      }));
    }
    // Default handling for other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.productId) newErrors.productId = 'Product/Service is required';
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (!formData.saleDate) newErrors.saleDate = 'Sale date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setSubmitError(null);
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      customerId: parseInt(formData.customerId),
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      totalAmount: parseFloat(formData.totalAmount)
    };
    
    try {
      if (sale) {
        await updateSale(sale.id, submissionData);
      } else {
        await createSale(submissionData);
      }
      onClose(true); // Close with refresh flag
    } catch (error) {
      console.error('Error saving sale:', error);
      setSubmitError('Failed to save sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {sale ? 'Edit Sale' : 'Add New Sale'}
      </DialogTitle>
      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.customerId}>
                <InputLabel id="customer-label">Customer</InputLabel>
                <Select
                  labelId="customer-label"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  label="Customer"
                  disabled={loading}
                  required
                >
                  <MenuItem value=""><em>Select a customer</em></MenuItem>
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.customerId && <FormHelperText>{errors.customerId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.productId}>
                <InputLabel id="product-label">Product/Service</InputLabel>
                <Select
                  labelId="product-label"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  label="Product/Service"
                  disabled={loading}
                  required
                >
                  <MenuItem value=""><em>Select a product/service</em></MenuItem>
                  {products.map(product => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.productId && <FormHelperText>{errors.productId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                inputProps={{ min: '1', step: '1' }}
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sale Date"
                name="saleDate"
                type="date"
                value={formData.saleDate}
                onChange={handleChange}
                error={!!errors.saleDate}
                helperText={errors.saleDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Amount (u00a3)"
                name="totalAmount"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.totalAmount}
                disabled={true} // Auto-calculated, so disabled
                helperText="Automatically calculated based on product price and quantity"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleModal;
