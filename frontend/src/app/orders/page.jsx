"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Stack,
  Divider,
  Alert,
  Skeleton,
  Button
} from "@mui/material";
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  AccessTime
} from "@mui/icons-material";
import Link from "next/link";
import api from "@/utils/api";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/user/orders/");
        setOrders(response.data.results || response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle sx={{ color: "success.main" }} />;
      case 'pending':
      case 'cod_pending':
        return <AccessTime sx={{ color: "warning.main" }} />;
      case 'cancelled':
        return <Cancel sx={{ color: "error.main" }} />;
      default:
        return <LocalShipping sx={{ color: "info.main" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return "success";
      case 'pending':
      case 'cod_pending':
        return "warning";
      case 'cancelled':
        return "error";
      default:
        return "info";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending Payment';
      case 'cod_pending':
        return 'Cash on Delivery';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'shipped':
        return 'Shipped';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontWeight: 600, color: "primary.main" }}>
            My Orders
          </Typography>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: "primary.main"
            }}
          >
            My Orders
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Track your orders and view order history
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 6, textAlign: "center" }}>
              <ShoppingBag sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No Orders Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You haven't placed any orders yet. Start shopping to see your orders here.
              </Typography>
              <Button
                component={Link}
                href="/products"
                variant="contained"
                sx={{
                  bgcolor: "secondary.main",
                  color: "primary.main",
                  "&:hover": { bgcolor: "secondary.dark" }
                }}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => (
              <Card 
                key={order.id}
                sx={{ 
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                    transition: "all 0.3s ease"
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Typography variant="h6" fontWeight={600}>
                            Order #{order.id}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={formatStatus(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Payment Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </Typography>

                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                            Items ({order.items?.length || 0}):
                          </Typography>
                          <Stack spacing={0.5}>
                            {order.items?.slice(0, 3).map((item, index) => (
                              <Typography key={index} variant="body2" color="text.secondary">
                                • {item.product_title} (Qty: {item.quantity})
                              </Typography>
                            ))}
                            {order.items?.length > 3 && (
                              <Typography variant="body2" color="text.secondary">
                                • ... and {order.items.length - 3} more items
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Stack spacing={2} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                        <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="primary.main">
                            ₹{order.total}
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                          <Typography variant="body2" color="text.secondary">
                            Shipping Address
                          </Typography>
                          <Typography variant="body2">
                            {order.address?.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.address?.city}, {order.address?.state}
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ alignSelf: { xs: "flex-start", md: "flex-end" } }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
