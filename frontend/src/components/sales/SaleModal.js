import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText,
  Box, Divider, Paper
} from '@mui/material';
import {
  ShoppingCart, Person, Inventory, CalendarToday, AttachMoney, Add, Edit,
  Save, Cancel, LocalOffer
} from '@mui/icons-material';
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
    <Dialog 
      open={open} 
      onClose={() => onClose(false)} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, overflow: 'hidden' }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2.5,
          px: 3
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          {sale ? <Edit sx={{ mr: 1.5 }} /> : <Add sx={{ mr: 1.5 }} />}
          {sale ? 'Edit Sale' : 'Add New Sale'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 1, borderBottom: '1px solid #eee' }}>
              <ShoppingCart sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Sale Information
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.customerId} disabled={loading}>
                  <InputLabel id="customer-label">Customer *</InputLabel>
                  <Select
                    labelId="customer-label"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    label="Customer *"
                    required
                    size="medium"
                    startAdornment={<Person sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />}
                  >
                    <MenuItem value=""><em>Select a customer</em></MenuItem>
                    {customers.map(customer => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.customerId || 'Select the customer making the purchase'}</FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.productId} disabled={loading}>
                  <InputLabel id="product-label">Product/Service *</InputLabel>
                  <Select
                    labelId="product-label"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    label="Product/Service *"
                    required
                    size="medium"
                    startAdornment={<Inventory sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />}
                  >
                    <MenuItem value=""><em>Select a product/service</em></MenuItem>
                    {products.map(product => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.productId || 'Select the product or service being sold'}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 1, borderBottom: '1px solid #eee' }}>
              <LocalOffer sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Order Details
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity *"
                  name="quantity"
                  type="number"
                  inputProps={{ min: '1', step: '1' }}
                  value={formData.quantity}
                  onChange={handleChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity || 'Number of items'}
                  disabled={loading}
                  required
                  size="medium"
                  InputProps={{
                    startAdornment: <LocalOffer sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sale Date *"
                  name="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={handleChange}
                  error={!!errors.saleDate}
                  helperText={errors.saleDate || 'Date of the sale'}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  required
                  size="medium"
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                    Total Amount
                  </Typography>
                  
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatCurrency(formData.totalAmount)}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Automatically calculated based on product price and quantity
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={() => onClose(false)} 
          disabled={loading}
          startIcon={<Cancel />}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={<Save />}
          size="large"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleModal;
