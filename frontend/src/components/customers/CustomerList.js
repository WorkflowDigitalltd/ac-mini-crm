import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, Box, CircularProgress, IconButton 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getCustomers, deleteCustomer } from '../../services/api';
import CustomerModal from './CustomerModal';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setOpenModal(true);
  };

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    setOpenModal(true);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete customer. Please try again.');
        console.error(err);
      }
    }
  };

  const handleCloseModal = (refreshNeeded = false) => {
    setOpenModal(false);
    if (refreshNeeded) {
      fetchCustomers();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchCustomers} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Customers</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
      </Box>

      {customers.length === 0 ? (
        <Typography>No customers found. Add your first customer to get started.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Postcode</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.postcode}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditCustomer(customer)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CustomerModal 
        open={openModal} 
        onClose={handleCloseModal} 
        customer={currentCustomer} 
      />
    </>
  );
};

export default CustomerList;
