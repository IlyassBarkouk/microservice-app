import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Paper, Button, TextField, Rating } from '@mui/material';

const OrderAdress = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { items, restaurant } = state || {};

  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!items || !restaurant) {
    return <Typography>Commande invalide</Typography>;
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmOrder = async () => {
    if (!address) return alert('Veuillez saisir une adresse de livraison.');

    setLoading(true);
    try {
      // create order
      await axios.post('http://localhost:8086/api/orders', {
        userId: 1,
        restaurantId: restaurant.id,
        deliveryAddress: address,
        orderItems: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }))
      });

      // create review
      if (rating > 0) {
        await axios.post('http://localhost:8086/api/reviews', {
          entityId: restaurant.id,
          type: 'RESTAURANT',
          userId: 1,
          rating,
          comment: '',
          moderated: true
        });
      }

      alert('Commande et avis créés avec succès');
      navigate('/orders', { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la commande ou de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" mt={3} mb={2}>Votre commande</Typography>

      {items.map(item => (
        <Paper key={item.menuItemId} sx={{ p: 2, mb: 1 }}>
          <Typography>{item.quantity} × {item.name}</Typography>
          <Typography>{(item.price * item.quantity).toFixed(2)} €</Typography>
        </Paper>
      ))}

      <Typography fontWeight="bold" mt={2}>Total: {totalPrice.toFixed(2)} €</Typography>

      <TextField
        fullWidth
        label="Adresse de livraison"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Box mt={2}>
        <Typography>Donnez une note au restaurant :</Typography>
        <Rating
          name="restaurant-rating"
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={confirmOrder}
        disabled={loading || !address}
      >
        {loading ? 'Chargement...' : 'Confirmer la commande'}
      </Button>
    </Container>
  );
};

export default OrderAdress;
