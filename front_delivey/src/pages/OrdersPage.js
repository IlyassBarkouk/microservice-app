import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip,
  Button,
  Modal,
  Rating,
  TextField,
} from '@mui/material';

const API_URL = 'http://localhost:8086/api/orders';
const DELIVERY_API = 'http://localhost:8083/api/deliveries';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rating Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [deliveryComment, setDeliveryComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (order) => {
    try {
      await axios.put(`${API_URL}/${order.id}/status?status=CONFIRMED`);
      
      // Create a delivery for this order
      const deliveryRes = await axios.post(`${DELIVERY_API}/create-for-order`, {
        orderId: order.id,
        deliveryAddress: order.deliveryAddress,
      });

      setSelectedDelivery(deliveryRes.data); // Save delivery info
      setOpenModal(true); // Open modal for rating
      loadOrders();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la confirmation de la commande');
    }
  };

  const cancelOrder = async (order) => {
    try {
      await axios.put(`${API_URL}/${order.id}/status?status=CANCELLED`);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation de la commande");
    }
  };

  const submitDeliveryRating = async () => {
    if (!deliveryRating) return alert('Veuillez donner une note');

    setRatingLoading(true);
    try {
      await axios.post(`${DELIVERY_API}/${selectedDelivery.id}/rate`, {
        rating: deliveryRating,
        comment: deliveryComment,
      });

      setOpenModal(false);
      setDeliveryRating(0);
      setDeliveryComment('');
      setSelectedDelivery(null);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'envoi de la note');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mes Commandes
      </Typography>

      {/* PENDING */}
      <Section title="⏳ En attente">
        {pendingOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onConfirm={() => updateStatus(order)}
            onCancel={() => cancelOrder(order)}
            actions
          />
        ))}
      </Section>

      {/* CONFIRMED */}
      <Section title="✅ Confirmées">
        {confirmedOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </Section>

      {/* CANCELLED */}
      <Section title="❌ Annulées">
        {cancelledOrders.map(order => (
          <OrderCard key={order.id} order={order} cancelled />
        ))}
      </Section>

      {/* =========================
          DELIVERY RATING MODAL
      ========================= */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="delivery-rating-modal"
        aria-describedby="rate-the-delivery"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Évaluez la livraison
          </Typography>

          <Rating
            name="delivery-rating"
            value={deliveryRating}
            onChange={(e, newValue) => setDeliveryRating(newValue)}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
            placeholder="Commentaire (optionnel)"
            value={deliveryComment}
            onChange={(e) => setDeliveryComment(e.target.value)}
          />

          <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={submitDeliveryRating}
              disabled={ratingLoading}
            >
              {ratingLoading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

/* =========================
   REUSABLE SECTION
========================= */
const Section = ({ title, children }) => (
  <>
    <Typography variant="h5" mt={5} mb={2}>
      {title}
    </Typography>
    {children.length === 0 ? (
      <Typography color="text.secondary">
        Aucune commande
      </Typography>
    ) : (
      children
    )}
  </>
);

/* =========================
   ORDER CARD
========================= */
const OrderCard = ({ order, onConfirm, onCancel, actions, cancelled }) => {
  const statusColor = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'error',
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, opacity: cancelled ? 0.6 : 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">
            Commande #{order.id}
          </Typography>
          <Chip
            label={order.status}
            color={statusColor[order.status]}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        {order.orderItems.map(item => (
          <Typography key={item.id}>
            {item.quantity}x {item.menuItemName}
          </Typography>
        ))}

        <Divider sx={{ my: 1 }} />

        <Typography fontWeight="bold">
          Total : {order.totalPrice} €
        </Typography>

        {order.deliveryAddress && (
          <Typography color="text.secondary">
            📍 {order.deliveryAddress}
          </Typography>
        )}

        {actions && (
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
            >
              Confirmer
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
