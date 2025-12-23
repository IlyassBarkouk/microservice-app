import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            Food Delivery
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', ml: 3 }}>
            <Button
              component={RouterLink}
              to="/restaurants"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Restaurants
            </Button>
            <Button
              component={RouterLink}
              to="/orders"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Mes Commandes
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" component="span" sx={{ mr: 2, color: 'white' }}>
                  Bonjour, {user.name}
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ color: 'white' }}
                >
                  Déconnexion
                </Button>
              </Box>
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ color: 'white' }}
              >
                Connexion
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
