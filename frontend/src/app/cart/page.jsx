"use client";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Stack, 
  Button, 
  IconButton,
  Divider,
  Paper
} from "@mui/material";
import { Remove, Add, Delete } from "@mui/icons-material";
import { useAtom } from "jotai";
import { cartAtom, updateQuantityAtom, removeFromCartAtom, clearCartAtom } from "@/store/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart] = useAtom(cartAtom);
  const [, updateQuantity] = useAtom(updateQuantityAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const finalTotal = total + shipping;

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Add some beautiful jewellery to get started!
          </Typography>
          <Button 
            component={Link} 
            href="/products" 
            variant="contained" 
            size="large"
            sx={{ mt: 2 }}
          >
            Shop Now
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 3, sm: 2 }}>
                      {item.primary_image ? (
                        <Box
                          component="img"
                          src={item.primary_image}
                          sx={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 1
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: 80,
                            bgcolor: "grey.100",
                            borderRadius: 1
                          }}
                        />
                      )}
                    </Grid>
                    
                    <Grid size={{ xs: 6, sm: 7 }}>
                      <Typography fontWeight={600} gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary">
                        ₹{item.price} each
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 3, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Order Summary
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Subtotal ({cart.length} items)</Typography>
                <Typography>₹{total.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={600}>Total</Typography>
                <Typography variant="h6" fontWeight={600}>₹{finalTotal.toFixed(2)}</Typography>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={clearCart}
                color="error"
              >
                Clear Cart
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
