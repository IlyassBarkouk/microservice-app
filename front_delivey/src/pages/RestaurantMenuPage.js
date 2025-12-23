import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Paper, Button, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const RestaurantMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!restaurant) {
          const restaurantRes = await axios.get(`http://localhost:8086/api/restaurants/${id}`);
          setRestaurant(restaurantRes.data);
        }
        const menuRes = await axios.get(`http://localhost:8086/api/menu-items/search/findByRestaurantId?restaurantId=${id}`);
        setMenuItems(menuRes.data._embedded?.menuItems || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, restaurant]);

  const getItemKey = (item) => item._links.self.href;
  const extractIdFromHref = (href) => Number(href.split('/').pop());

  const addItem = (item) => {
    const key = getItemKey(item);
    const menuItemId = extractIdFromHref(item._links.self.href);
    setSelectedItems(prev => ({
      ...prev,
      [key]: prev[key] ? { ...prev[key], quantity: prev[key].quantity + 1 } : { key, menuItemId, name: item.name, price: item.price, quantity: 1 }
    }));
  };

  const decrementItem = (key) => {
    setSelectedItems(prev => {
      const item = prev[key];
      if (!item) return prev;
      if (item.quantity === 1) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: { ...item, quantity: item.quantity - 1 } };
    });
  };

  const removeItem = (key) => {
    setSelectedItems(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  if (loading) return <Box textAlign="center" mt={6}><Typography>Chargement...</Typography></Box>;
  if (!restaurant) return <Box textAlign="center" mt={6}><Typography>Restaurant introuvable</Typography></Box>;

  return (
    <Container maxWidth="md">
      <Box display="flex" alignItems="center" mt={3} mb={3}>
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <Typography variant="h4" ml={2}>{restaurant.name}</Typography>
      </Box>

      <Typography color="text.secondary" mb={2}>{restaurant.cuisine} • {restaurant.address}</Typography>
      <Divider sx={{ mb: 3 }} />

      {menuItems.map(item => {
        const key = getItemKey(item);
        const selectedItem = selectedItems[key];

        return (
          <Paper key={key} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{item.name}</Typography>
              <Typography color="text.secondary">{item.description}</Typography>
              <Typography fontWeight="bold">{item.price.toFixed(2)} €</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              {selectedItem ? (
                <>
                  <IconButton onClick={() => decrementItem(key)}><RemoveIcon /></IconButton>
                  <Typography mx={1}>{selectedItem.quantity}</Typography>
                  <IconButton onClick={() => addItem(item)}><AddIcon /></IconButton>
                  <IconButton onClick={() => removeItem(key)}><CloseIcon /></IconButton>
                </>
              ) : (
                <Button variant="outlined" onClick={() => addItem(item)}>Ajouter</Button>
              )}
            </Box>
          </Paper>
        );
      })}

      {Object.keys(selectedItems).length > 0 && (
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate('/orderadress', {
            state: {
              items: Object.values(selectedItems),
              restaurant
            }
          })}
        >
          Commander
        </Button>
      )}
    </Container>
  );
};

export default RestaurantMenuPage;
