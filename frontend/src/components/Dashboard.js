import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, CircularProgress, Card, CardContent,
  List, ListItem, ListItemText, Divider
} from '@mui/material';
import { getCustomers, getProducts, getSales } from '../services/api';
import { formatCurrency } from '../utils/validation';

const Dashboard = () => {
  const [data, setData] = useState({
    customers: [],
    products: [],
    sales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customers, products, sales] = await Promise.all([
          getCustomers(),
          getProducts(),
          getSales()
        ]);
        
        setData({ customers, products, sales });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Calculate summary statistics
  const totalCustomers = data.customers.length;
  const totalProducts = data.products.length;
  const totalSales = data.sales.length;
  const totalRevenue = data.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  // Get recent customers
  const recentCustomers = [...data.customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get top selling products
  const productSales = data.products.map(product => {
    const sales = data.sales.filter(sale => sale.productId === product.id);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    return { ...product, totalQuantity, totalRevenue };
  });

  const topProducts = [...productSales]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Customers</Typography>
              <Typography variant="h4">{totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Products</Typography>
              <Typography variant="h4">{totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Sales</Typography>
              <Typography variant="h4">{totalSales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
              <Typography variant="h4">{formatCurrency(totalRevenue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Customers and Top Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Customers</Typography>
            {recentCustomers.length === 0 ? (
              <Typography variant="body2">No customers yet</Typography>
            ) : (
              <List>
                {recentCustomers.map((customer, index) => (
                  <React.Fragment key={customer.id}>
                    <ListItem>
                      <ListItemText 
                        primary={customer.name} 
                        secondary={customer.email} 
                      />
                    </ListItem>
                    {index < recentCustomers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
            {topProducts.length === 0 ? (
              <Typography variant="body2">No sales data yet</Typography>
            ) : (
              <List>
                {topProducts.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <ListItem>
                      <ListItemText 
                        primary={product.name} 
                        secondary={`Sold: ${product.totalQuantity} | Revenue: ${formatCurrency(product.totalRevenue)}`} 
                      />
                    </ListItem>
                    {index < topProducts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
