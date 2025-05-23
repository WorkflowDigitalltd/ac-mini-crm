import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, Box, CircularProgress, IconButton 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getSales, deleteSale, getCustomers, getProducts } from '../../services/api';
import SaleModal from './SaleModal';
import { formatCurrency, formatUKDate } from '../../utils/validation';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesData, customersData, productsData] = await Promise.all([
        getSales(),
        getCustomers(),
        getProducts()
      ]);
      setSales(salesData);
      setCustomers(customersData);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSale = () => {
    setCurrentSale(null);
    setOpenModal(true);
  };

  const handleEditSale = (sale) => {
    setCurrentSale(sale);
    setOpenModal(true);
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(id);
        fetchData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete sale. Please try again.');
        console.error(err);
      }
    }
  };

  const handleCloseModal = (refreshNeeded = false) => {
    setOpenModal(false);
    if (refreshNeeded) {
      fetchData();
    }
  };

  // Helper function to get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  // Helper function to get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
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
        <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Sales</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddSale}
        >
          Add Sale
        </Button>
      </Box>

      {sales.length === 0 ? (
        <Typography>No sales found. Add your first sale to get started.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Product/Service</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatUKDate(sale.saleDate)}</TableCell>
                  <TableCell>{getCustomerName(sale.customerId)}</TableCell>
                  <TableCell>{getProductName(sale.productId)}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditSale(sale)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteSale(sale.id)}
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

      <SaleModal 
        open={openModal} 
        onClose={handleCloseModal} 
        sale={currentSale}
        customers={customers}
        products={products}
      />
    </>
  );
};

export default SaleList;
