import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h2" gutterBottom>
          Bienvenue sur Food Delivery
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Commandez vos plats préférés des meilleurs restaurants de votre ville
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/restaurants"
            startIcon={<RestaurantIcon />}
          >
            Voir les restaurants
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/orders"
            startIcon={<LocalShippingIcon />}
          >
            Suivre ma commande
          </Button>
        </Box>

        <Box sx={{ mt: 8, display: 'flex', gap: 6 }}>
          <Box sx={{ maxWidth: 300 }}>
            <RestaurantIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Restaurants variés
            </Typography>
            <Typography>
              Découvrez une sélection des meilleurs restaurants de votre région.
            </Typography>
          </Box>
          
          <Box sx={{ maxWidth: 300 }}>
            <LocalShippingIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Livraison rapide
            </Typography>
            <Typography>
              Recevez votre commande en un temps record, encore chaude et savoureuse.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
