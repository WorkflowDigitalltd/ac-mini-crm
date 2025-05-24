import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText, Box,
  Switch, FormControlLabel, Divider, Paper
} from '@mui/material';
import { 
  Inventory, Description, AttachMoney, Category, Refresh, Save, Cancel, Edit, Add
} from '@mui/icons-material';
import { createProduct, updateProduct } from '../../services/api';

const ProductModal = ({ open, onClose, product }) => {
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    type: 'Product', // Default to Product
    recurring: 'None', // None, Monthly, Annual
    renewalPrice: '',
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
        type: product.type || 'Product',
        recurring: product.recurring || 'None',
        renewalPrice: product.renewalPrice?.toString() || '',
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

    // Renewal price validation if recurring is not None
    if (formData.recurring !== 'None') {
      if (!formData.renewalPrice) {
        newErrors.renewalPrice = 'Renewal price is required for recurring products/services';
      } else if (isNaN(formData.renewalPrice) || parseFloat(formData.renewalPrice) < 0) {
        newErrors.renewalPrice = 'Renewal price must be a valid positive number';
      }
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
      price: parseFloat(formData.price),
      renewalPrice: formData.recurring !== 'None' ? parseFloat(formData.renewalPrice) : null
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

  // Handle recurring toggle
  const handleRecurringToggle = (e) => {
    const isRecurring = e.target.checked;
    setFormData(prev => ({
      ...prev,
      recurring: isRecurring ? 'Monthly' : 'None',
      renewalPrice: isRecurring ? prev.renewalPrice : ''
    }));
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
          {product ? <Edit sx={{ mr: 1.5 }} /> : <Add sx={{ mr: 1.5 }} />}
          {product ? 'Edit Product/Service' : 'Add New Product/Service'}
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
              <Inventory sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Basic Information
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name || ' '}
                  disabled={loading}
                  required
                  autoComplete="off"
                  size="medium"
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    startAdornment: <Inventory sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                  sx={{ mb: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Type"
                    onChange={handleChange}
                    size="medium"
                    startAdornment={<Category sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />}
                  >
                    <MenuItem value="Product">Product</MenuItem>
                    <MenuItem value="Service">Service</MenuItem>
                  </Select>
                  <FormHelperText>Product or service</FormHelperText>
                </FormControl>
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
                  rows={3}
                  size="medium"
                  inputProps={{ maxLength: 200 }}
                  InputProps={{
                    startAdornment: <Description sx={{ color: 'text.secondary', mr: 1, mt: 1 }} fontSize="small" />
                  }}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 1, borderBottom: '1px solid #eee' }}>
              <AttachMoney sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Pricing Information
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price (£) *"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price || ' '}
                  disabled={loading}
                  required
                  size="medium"
                  inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', maxLength: 10 }}
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={formData.recurring !== 'None'} 
                        onChange={handleRecurringToggle}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Refresh sx={{ mr: 0.5, color: formData.recurring !== 'None' ? 'primary.main' : 'text.secondary' }} />
                        <Typography sx={{ fontWeight: formData.recurring !== 'None' ? 'bold' : 'normal' }}>
                          Recurring Billing
                        </Typography>
                      </Box>
                    }
                  />
                  
                  {formData.recurring !== 'None' && (
                    <Box sx={{ mt: 2, ml: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth disabled={loading} size="small">
                            <InputLabel>Frequency</InputLabel>
                            <Select
                              name="recurring"
                              value={formData.recurring}
                              label="Frequency"
                              onChange={handleChange}
                            >
                              <MenuItem value="Monthly">Monthly</MenuItem>
                              <MenuItem value="Annual">Annual</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label={`Renewal Price (£) *`}
                            name="renewalPrice"
                            value={formData.renewalPrice}
                            onChange={handleChange}
                            error={!!errors.renewalPrice}
                            helperText={errors.renewalPrice || ' '}
                            disabled={loading}
                            required
                            inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', maxLength: 10 }}
                          />
                        </Grid>
                      </Grid>
                      <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 1, fontWeight: 'medium' }}>
                        This product/service will renew {formData.recurring.toLowerCase()} at £{formData.renewalPrice || '0'}
                      </Typography>
                    </Box>
                  )}
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

export default ProductModal;
