"use client";
import { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Stack, 
  Button, 
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useAtom } from "jotai";
import { cartAtom, clearCartAtom } from "@/store/cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";

export default function CheckoutPage() {
  const [cart] = useAtom(cartAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    payment_method: "razorpay"
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    
    if (!token) {
      setShowLoginDialog(true);
    }
    (async () => {
      try {
        const [addrRes, profRes] = await Promise.all([
          api.get("/addresses/"),
          api.get("/user/profile/")
        ]);
        setAddresses(addrRes.data.results || addrRes.data);
        setUserPhone(profRes.data.phone || "");
      } catch (e) {}
    })();
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Resolve address id: pick existing or create new
      let addressId = selectedAddressId;
      if (!addressId) {
        const addressResponse = await api.post("/addresses/", formData);
        addressId = addressResponse.data.id;
      }
      
      // Create order
      const orderData = {
        address_id: addressId,
        payment_method: formData.payment_method,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const orderResponse = await api.post("/checkout/create-order/", orderData);
      
      if (formData.payment_method === "razorpay") {
        // Create Razorpay order
        const razorpayResponse = await api.post("/checkout/razorpay/create/", {
          order_id: orderResponse.data.order_id
        });

        // Load Razorpay script and open checkout
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const options = {
            key: "rzp_test_RKcclTBtTFN1El",
            amount: razorpayResponse.data.amount,
            currency: razorpayResponse.data.currency,
            name: "Luxe Adorn",
            description: "Premium Jewelry Purchase",
            order_id: razorpayResponse.data.razorpay_order_id,
            prefill: {
              contact: userPhone || formData.phone || "",
            },
            handler: async function (response) {
              try {
                await api.post("/checkout/razorpay/verify/", {
                  order_id: orderResponse.data.order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                });
                
                clearCart();
                router.push("/order-success");
              } catch (error) {
                setError("Payment verification failed");
              }
            },
            theme: {
              color: "#d4af37"
            }
          };
          
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        // COD order
        clearCart();
        router.push("/order-success");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push("/products")}
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
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Shipping Information
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                {/* Address selection */}
                {addresses.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      Choose an address
                    </Typography>
                    <Stack spacing={1}>
                      {addresses.map(a => (
                        <Button
                          key={a.id}
                          variant={selectedAddressId === String(a.id) ? "contained" : "outlined"}
                          onClick={() => { setSelectedAddressId(String(a.id)); setAddingNewAddress(false); }}
                          sx={{ justifyContent: "flex-start" }}
                        >
                          {a.full_name}, {a.line1}, {a.city}
                        </Button>
                      ))}
                    </Stack>
                    <Button sx={{ mt: 1 }} onClick={() => { setSelectedAddressId(""); setAddingNewAddress(true); }}>
                      + Add new address
                    </Button>
                  </Box>
                )}

                {/* New address form */}
                {addresses.length === 0 || addingNewAddress || !selectedAddressId ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Address Line 1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      name="line2"
                      value={formData.line2}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      required
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      required
                      fullWidth
                      label="Postal Code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                ) : null}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Payment Method
                </Typography>
                
                <FormControl component="fieldset">
                  <RadioGroup
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    name="payment_method"
                  >
                    <FormControlLabel 
                      value="razorpay" 
                      control={<Radio />} 
                      label="Online Payment (Razorpay)" 
                    />
                    <FormControlLabel 
                      value="cod" 
                      control={<Radio />} 
                      label="Cash on Delivery" 
                    />
                  </RadioGroup>
                </FormControl>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Order Summary
            </Typography>
            
            <Stack spacing={2}>
              {cart.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    {item.title} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              
              <Divider />
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{total.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              
              <Divider />
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={600}>Total</Typography>
                <Typography variant="h6" fontWeight={600}>₹{total.toFixed(2)}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>
          Login Required
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You need to be logged in to proceed with checkout. Please sign in or create an account to continue.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Creating an account allows you to track your orders and manage your addresses.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            component={Link} 
            href="/signup" 
            variant="contained"
            sx={{
              bgcolor: "secondary.main",
              color: "primary.main",
              "&:hover": { bgcolor: "secondary.dark" }
            }}
          >
            Create Account
          </Button>
          <Button 
            component={Link} 
            href="/login" 
            variant="outlined"
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
