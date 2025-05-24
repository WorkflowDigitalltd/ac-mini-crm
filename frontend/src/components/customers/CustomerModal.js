import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, Alert, Box,
  Divider, Paper, FormHelperText
} from '@mui/material';
import {
  Person, Email, Phone, Home, LocationOn, Edit, Add,
  Save, Cancel
} from '@mui/icons-material';
import { createCustomer, updateCustomer } from '../../services/api';
import { isValidUKPostcode, isValidUKPhoneNumber } from '../../utils/validation';

const CustomerModal = ({ open, onClose, customer }) => {
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    postcode: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id, // Ensure id is included for editing
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        postcode: customer.postcode || ''
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setSubmitError(null);
  }, [customer, open]);

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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // UK-specific validations
    if (formData.phone && !isValidUKPhoneNumber(formData.phone)) {
      newErrors.phone = 'Invalid UK phone number format';
    }
    
    if (formData.postcode && !isValidUKPostcode(formData.postcode)) {
      newErrors.postcode = 'Invalid UK postcode format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(null);
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError(null);
    try {
      if (customer) {
        await updateCustomer(customer.id, formData);
        setSubmitSuccess('Customer updated successfully!');
      } else {
        await createCustomer(formData);
        setSubmitSuccess('Customer added successfully!');
      }
      setTimeout(() => {
        setSubmitSuccess(null);
        onClose(true); // Close with refresh flag
      }, 1000);
    } catch (error) {
      console.error('Error saving customer:', error);
      setSubmitError('Failed to save customer. Please try again.');
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
          {customer ? <Edit sx={{ mr: 1.5 }} /> : <Add sx={{ mr: 1.5 }} />}
          {customer ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {submitSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 1, borderBottom: '1px solid #eee' }}>
              <Person sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Personal Information
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
                  size="medium"
                  autoComplete="off"
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email || ' '}
                  disabled={loading}
                  required
                  size="medium"
                  autoComplete="off"
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone || 'UK format (e.g., 07700 900000)'}
                  disabled={loading}
                  size="medium"
                  inputProps={{ maxLength: 20 }}
                  InputProps={{
                    startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 1, borderBottom: '1px solid #eee' }}>
              <Home sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Address Information
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                  multiline
                  rows={3}
                  size="medium"
                  inputProps={{ maxLength: 200 }}
                  InputProps={{
                    startAdornment: <Home sx={{ color: 'text.secondary', mr: 1, mt: 1 }} fontSize="small" />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  error={!!errors.postcode}
                  helperText={errors.postcode || 'UK format (e.g., AB12 3CD)'}
                  disabled={loading}
                  size="medium"
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                  }}
                />
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

export default CustomerModal;
