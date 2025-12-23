import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <Card sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" component="div">
                {item.name}
                {item.isPopular && (
                  <Chip 
                    label="Populaire" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 1, fontSize: '0.7rem' }} 
                  />
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {item.description}
              </Typography>
              {item.allergens && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Allergènes : {item.allergens}
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary">
                {item.price.toFixed(2)} €
              </Typography>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => onAddToCart(item)}
                sx={{ mt: 1 }}
              >
                Ajouter
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default MenuItem;
