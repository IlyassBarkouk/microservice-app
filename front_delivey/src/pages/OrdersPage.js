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
} from '@mui/material';

const API_URL = 'http://localhost:8086/api/orders';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}/status?status=${status}`);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

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
            onConfirm={() => updateStatus(order.id, 'CONFIRMED')}
            onCancel={() => updateStatus(order.id, 'CANCELLED')}
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
