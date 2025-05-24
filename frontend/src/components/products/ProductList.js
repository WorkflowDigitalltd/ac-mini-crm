import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, Box, CircularProgress, IconButton 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getProducts, deleteProduct } from '../../services/api';
import ProductModal from './ProductModal';
import { formatCurrency } from '../../utils/validation';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setOpenModal(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setOpenModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError('Failed to delete product. Please try again.');
        console.error(err);
      }
    }
  };

  const handleCloseModal = (refreshNeeded = false) => {
    setOpenModal(false);
    if (refreshNeeded) {
      fetchProducts();
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
        <Button variant="contained" onClick={fetchProducts} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={2} gap={2}>
        <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>Products & Services</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddProduct}
          size="large"
          sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
        >
          Add Product/Service
        </Button>
      </Box>

      {products.length === 0 ? (
        <Typography>No products found. Add your first product to get started.</Typography>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper} sx={{ minWidth: 600, boxShadow: 3 }}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{product.name}</TableCell>
                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{product.description}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditProduct(product)}
                        size="small"
                        aria-label="Edit"
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteProduct(product.id)}
                        size="small"
                        aria-label="Delete"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <ProductModal 
        open={openModal} 
        onClose={handleCloseModal} 
        product={currentProduct} 
      />
    </>
  );
};

export default ProductList;
