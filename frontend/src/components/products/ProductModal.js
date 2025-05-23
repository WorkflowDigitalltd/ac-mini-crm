import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import { createProduct, updateProduct } from '../../services/api';

const ProductModal = ({ open, onClose, product }) => {
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    type: 'Product' // Default to Product
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        type: product.type || 'Product'
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setSubmitError(null);
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
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
      price: parseFloat(formData.price)
    };
    
    try {
      if (product) {
        await updateProduct(product.id, submissionData);
      } else {
        await createProduct(submissionData);
      }
      onClose(true); // Close with refresh flag
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product ? 'Edit Product/Service' : 'Add New Product/Service'}
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
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (£)"
                name="price"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                  disabled={loading}
                >
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                </Select>
              </FormControl>
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

export default ProductModal;
