import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Star, StarBorder, StarHalf } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:8086/api/restaurants');
        const data = res.data._embedded.restaurants.map(r => ({
          ...r,
          id: r._links.self.href.split('/').pop(),
          averageRating: 0
        }));

        const statsPromises = data.map(r =>
          axios.get(`http://localhost:8086/api/reviews/restaurant/${r.id}/stats`).then(s => s.data)
        );
        const statsResults = await Promise.all(statsPromises);

        const restaurantsWithRatings = data.map((r, idx) => ({
          ...r,
          averageRating: statsResults[idx].averageRating || 0,
          totalReviews: statsResults[idx].totalReviews || 0
        }));

        setRestaurants(restaurantsWithRatings);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push(<Star key={i} color="warning" />);
    if (halfStar) stars.push(<StarHalf key="half" color="warning" />);
    while (stars.length < 5) stars.push(<StarBorder key={'empty' + stars.length} color="warning" />);
    return stars;
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Nos Restaurants Partenaires</Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Rechercher un restaurant ou une cuisine..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
      />

      <Grid container spacing={4}>
        {filteredRestaurants.length > 0 ? filteredRestaurants.map((restaurant) => (
          <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={restaurant.imageUrl || 'https://source.unsplash.com/random/400x300?restaurant'}
                alt={restaurant.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5">{restaurant.name}</Typography>
                <Typography color="text.secondary" gutterBottom>{restaurant.cuisine}</Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {renderStars(restaurant.averageRating)}
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({restaurant.totalReviews || 0} avis)
                  </Typography>
                </Box>
              </CardContent>
              <Box p={2}>
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  to={`/restaurant/${restaurant.id}`}
                  state={{ restaurant }}
                >
                  Voir le menu
                </Button>
              </Box>
            </Card>
          </Grid>
        )) : (
          <Box width="100%" textAlign="center" p={4}>
            <Typography variant="h6" color="text.secondary">Aucun restaurant ne correspond à votre recherche.</Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default RestaurantsPage;
